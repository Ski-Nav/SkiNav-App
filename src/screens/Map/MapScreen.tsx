import {
  StyleSheet,
  Text,
  Keyboard,
  TextInput,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { COLORS, FONTS, SIZES } from "../../constants/constants";
import { ScreenContext } from "../../contexts/ScreenContext";
import { ResortContext } from "../../contexts/ResortContext";
import { displayError } from "../../helpers/helpers";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";

import {
  SearchableNode,
  SkiNavigator,
} from "../../routing/models/SkiNavigator";
import { useNavigation } from "@react-navigation/native";
import { Edge } from "../../routing/models/edge";
import { Node } from "../../routing/models/node";
import {
  MapViewWithHeading,
  ArrowedPolyline,
} from "react-native-maps-line-arrow";
import * as Location from "expo-location";
import CustomDropdown from "../../components/styled/CustomDropdown/CustomDropdown";

const NavigationScreen = () => {
  const { setLoading } = useContext(ScreenContext);
  const [currentRoute, setCurrentRoute] = useState<(Edge | Node)[]>(null);

  const [easySelected, setEasySelected] = useState(false);
  const [mediumSelected, setMediumSelected] = useState(false);
  const [hardSelected, setHardSelected] = useState(false);

  const skiNavigator = new SkiNavigator();
  const [graph, setGraph] = useState<{
    [fromId: string]: { [toId: string]: Edge };
  }>(null);
  const [nodes, setNodes] = useState<{ [id: string]: Node }>(null);
  const [edges, setEdges] = useState<{ [name: string]: Edge }>(null);
  const [searchableNodes, setSearchableNodes] =
    useState<SearchableNode[]>(null);
  const [region, setRegion] = useState<any>(null);

  const [fromNode, setFromNode] = useState<SearchableNode>(null);
  const [toNode, setToNode] = useState<SearchableNode>(null);

  const navigation = useNavigation<any>();
  const { currentResort } = useContext(ResortContext);

  const [location, setLocation] = useState<Location.LocationObject>(null);

  const [currentSpeechText, setCurrentSpeechText] = useState<string>(undefined);
  const allGraphLoaded = !(!region || !nodes || !edges || !searchableNodes);

  let lastLatLng: {
    latitude: number;
    longitude: number;
  } = undefined;
  // useEffect(() => {
  //   // Request permission to access the user's location
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert("Permission to access location was denied");
  //       return;
  //     }

  //     // Start listening for location updates
  //     let locationSubscription = await Location.watchPositionAsync(
  //       {
  //         accuracy: Location.Accuracy.Highest,
  //         timeInterval: 2000, // Update location every 5 seconds
  //         distanceInterval: 10, // Update location if the user moves 10 meters
  //       },
  //       (location) => {
  //         console.log("location updated!");
  //         console.log(JSON.stringify(location));
  //         setLocation(location);
  //       }
  //     );

  //     // Clean up the subscription when the component is unmounted
  //     return () => {
  //       if (locationSubscription) {
  //         locationSubscription.remove();
  //       }
  //     };
  //   })();
  // }, []);

  useEffect(() => {
    reroute(location);
  }, [location]);

  const manualUpdateUserLocation = async () => {
    // const location = await Location.getLastKnownPositionAsync();
    // console.log(location);
    // setLocation(location);

    // We're gonna just go next along the route
    const newArray = currentRoute.slice(2);
    setCurrentRoute(newArray);
    if (newArray[1] instanceof Edge) {
      setCurrentSpeechText("Travel along" + newArray[1].getName());
    } else {
      setCurrentSpeechText("FATAL ERROR IN SETTING EDGE SPEECH TEXT");
    }
  };

  useEffect(() => {
    console.log("UPDATED SPEECH TEXT: " + currentSpeechText);
    if(!currentSpeechText){
      return
    }
    speakText(currentSpeechText);
  }, [currentSpeechText]);

  const speakText = (text: string) => {
    try {
      Speech.speak(text, { language: "en" }); // Set the language code accordingly
    } catch (error) {
      console.error("Failed to speak the text:", error);
    }
  };

  const reroute = (location: Location.LocationObject) => {
    if (!location || !toNode || !currentRoute) {
      return;
    }

    const closestNode = skiNavigator.getClosestNode(
      location.coords.latitude,
      location.coords.longitude
    );

    console.log(nodes[closestNode]);
    generateRoute(closestNode, toNode.node.nodeId);
  };

  const generateRoute = (startNode: string, endNode: string) => {
    const set = new Set<number>();
    if (easySelected) {
      set.add(1);
    }
    if (mediumSelected) {
      set.add(2);
    }
    if (hardSelected) {
      set.add(3);
    }
    skiNavigator
      .requestGraph(currentResort)
      .then(() => {
        skiNavigator
          .findAllShortestPath([startNode, endNode], set)
          .then((result) => {
            setCurrentRoute(result[0]);
          })
          .catch((error: Error) => {
            displayError(error);
          });
      })
      .catch((error: Error) => {
        displayError(error);
      });
  };

  useEffect(() => {
    console.log("\n\n\n\n\nCURRENT ROUTE" + JSON.stringify(currentRoute));
    lastLatLng = undefined;
    if(!currentRoute){
      setCurrentSpeechText(undefined)
    }
    else{
      if(currentRoute[1] instanceof Edge){
        setCurrentSpeechText("Travel along " + currentRoute[1].getName())
      }
      else{
        setCurrentSpeechText("Travel along the slope")
      }
    }
  }, [currentRoute]);

  const onStartPressed = () => {
    if (!fromNode || !toNode) {
      return;
    }
    generateRoute(fromNode.node.nodeId, toNode.node.nodeId);
  };

  const onExitPressed = () => {
    Alert.alert(
      "Exit Resort",
      `Are you sure you want to exit ${currentResort}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => navigation.pop(),
        },
      ],
      { cancelable: false }
    );
  };

  const onStopRoutePressed = () => {
    setCurrentRoute(null);
  };

  const requestCurrentResort = async () => {
    await skiNavigator.requestGraph(currentResort);

    const graphData = skiNavigator.getGraph();
    const nodes = skiNavigator.getNodes();
    const edges = skiNavigator.getEdges();
    const searchableNodes = skiNavigator.getSearchableNodes();
    setNodes(nodes);
    setEdges(edges);
    setGraph(graphData);
    setSearchableNodes(searchableNodes);

    console.log(searchableNodes);

    let minLat = Infinity,
      maxLat = -Infinity,
      minLong = Infinity,
      maxLong = -Infinity;
    Object.keys(graphData).forEach((nodeID) => {
      minLat = Math.min(minLat, nodes[nodeID].getLatitude());
      maxLat = Math.max(maxLat, nodes[nodeID].getLatitude());
      minLong = Math.min(minLong, nodes[nodeID].getLongitude());
      maxLong = Math.max(maxLong, nodes[nodeID].getLongitude());
    });

    setRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLong + maxLong) / 2,
      latitudeDelta: Math.abs(maxLat - minLat) * 1.1,
      longitudeDelta: Math.abs(maxLong - minLong) * 1.1,
    });

    console.log(JSON.stringify(nodes));
  };

  const getPolylineColor = (edge: Edge) => {
    if (edge.edgeType != "SLOPE") {
      return "orange";
    } else {
      switch (edge.difficulty) {
        case 1:
          return "green";
        case 2:
          return "blue";
        case 3:
          return "black";
        default:
          return "gray";
      }
    }
  };

  const RenderSelectRouteComponent = () => {
    return (
      <View style={styles.container}>
        {allGraphLoaded && (
          <MapView
            followsUserLocation={!!currentRoute}
            showsUserLocation={true}
            style={styles.map}
            region={region}
          >
            {Object.keys(graph).map((nodeID) => {
              return (
                <Marker
                  key={nodeID + "NodeMarker"}
                  coordinate={{
                    latitude: nodes[nodeID].latitude,
                    longitude: nodes[nodeID].longitude,
                  }}
                >
                  <View />
                </Marker>
              );
            })}
            {Object.keys(graph).map((fromID) => {
              const edges = graph[fromID];
              return Object.keys(edges).map((toID) => {
                const edge = edges[toID];
                const coordinates = [
                  {
                    latitude: nodes[fromID].latitude,
                    longitude: nodes[fromID].longitude,
                  },
                  {
                    latitude: nodes[toID].latitude,
                    longitude: nodes[toID].longitude,
                  },
                ];

                return (
                  <View key={`${fromID}-${toID}`}>
                    <Polyline
                      coordinates={coordinates}
                      strokeColor={getPolylineColor(edge)}
                      strokeWidth={1}
                      lineDashPattern={[0]}
                    />
                    {fromNode && (
                      <Marker
                        coordinate={{
                          latitude: fromNode.node.getLatitude(),
                          longitude: fromNode.node.getLongitude(),
                        }}
                        pinColor="green"
                        title={"From"}
                        description={fromNode.name}
                      ></Marker>
                    )}
                    {toNode && (
                      <Marker
                        coordinate={{
                          latitude: toNode.node.getLatitude(),
                          longitude: toNode.node.getLongitude(),
                        }}
                        pinColor="yellow"
                        title={"To"}
                        description={toNode.name}
                      ></Marker>
                    )}
                  </View>
                );
              });
            })}
          </MapView>
        )}
        <View style={styles.bottomBackdrop}>
          <View>
            <Text style={{ fontFamily: FONTS.Medium, fontSize: 20 }}>
              Difficulty (select many)
            </Text>
          </View>
          <View style={styles.buttonControlsContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setEasySelected(!easySelected);
                }}
                style={{
                  ...styles.difficultyButton,
                  borderColor: easySelected ? COLORS.black : COLORS.white,
                }}
              >
                <MaterialCommunityIcons name="circle" size={30} color="green" />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setMediumSelected(!mediumSelected);
                }}
                style={{
                  ...styles.difficultyButton,
                  borderColor: mediumSelected ? COLORS.black : COLORS.white,
                }}
              >
                <MaterialCommunityIcons
                  name="square"
                  size={30}
                  color="darkblue"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setHardSelected(!hardSelected);
                }}
                style={{
                  ...styles.difficultyButton,
                  borderColor: hardSelected ? COLORS.black : COLORS.white,
                }}
              >
                <MaterialCommunityIcons
                  name="cards-diamond"
                  size={30}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onStartPressed}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onExitPressed}
                style={styles.exitButton}
              >
                <Text style={styles.startButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const RenderRoutingComponent = () => {
    return (
      <View style={styles.container}>
        {currentRoute && (
          <MapView showsUserLocation={true} style={styles.map} region={region}>
            {currentRoute.map((nodeOrEdge, index) => {
              if (nodeOrEdge instanceof Node) {
                const lat = nodeOrEdge.getLatitude();
                const long = nodeOrEdge.getLongitude();
                const coordinate = {
                  latitude: lat,
                  longitude: long,
                };
                if (index === 0) {
                  lastLatLng = coordinate;
                  return;
                }
                const lineCoordinates = [lastLatLng, coordinate];

                lastLatLng = coordinate;
                return (
                  <View>
                    <Marker
                      coordinate={{
                        latitude: lat,
                        longitude: long,
                      }}
                      pinColor={index === 2 ? "red" : "green"}
                    />
                    <Polyline
                      coordinates={lineCoordinates}
                      strokeColor="white"
                      strokeWidth={1}
                      lineDashPattern={[0]}
                    />
                  </View>
                );
              }
              if (nodeOrEdge instanceof Edge) {
                const coordinates = [
                  {
                    latitude: nodes[nodeOrEdge.fromID].getLatitude(),
                    longitude: nodes[nodeOrEdge.fromID].getLongitude(),
                  },
                  {
                    latitude: nodes[nodeOrEdge.toID].getLatitude(),
                    longitude: nodes[nodeOrEdge.toID].getLongitude(),
                  },
                ];

                console.log(coordinates);

                // There's a bug in the original edge code. Just doing a hotfix

                return (
                  <></>
                  // <View
                  //   key={"Edge" + nodeOrEdge.fromID + "to" + nodeOrEdge.toID}
                  // >
                  //   <Polyline
                  //     coordinates={coordinates}
                  //     strokeColor={"white"}
                  // strokeWidth={1}
                  // lineDashPattern={[0]}
                  //   />
                  // </View>
                );
              }
            })}
          </MapView>
        )}
        <View style={styles.topBackdrop}>
          <Text style={{ textAlign: "center", fontFamily: FONTS.Medium, fontSize: 20 }}>
            {currentSpeechText}
          </Text>
        </View>
        <View style={styles.bottomBackdrop}>
          <View style={styles.buttonControlsContainer}>
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={manualUpdateUserLocation}
                style={styles.startButton}
              >
                <Text style={styles.startButtonText}>
                  Manual Update Location
                </Text>
              </Pressable>
              <TouchableOpacity
                onPress={onStopRoutePressed}
                style={styles.exitButton}
              >
                <Text style={styles.startButtonText}>Stop Route</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    requestCurrentResort();
  }, []);

  return (
    <>
      {!currentRoute && searchableNodes && (
        <SafeAreaView
          style={{
            top: 20,
            position: "absolute",
            zIndex: 10,
            width: "90%",
            alignSelf: "center",
          }}
        >
          <CustomDropdown
            setSelectedData={setFromNode}
            data={searchableNodes}
            displayProperty={"name"}
            defaultText={"From..."}
          />
          <View style={{ height: 10 }} />
          <CustomDropdown
            setSelectedData={setToNode}
            data={searchableNodes}
            displayProperty={"name"}
            defaultText={"To..."}
          />
        </SafeAreaView>
      )}
      {currentRoute ? (
        <RenderRoutingComponent />
      ) : (
        <RenderSelectRouteComponent />
      )}
    </>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationSearchContainer: {
    position: "absolute",
    top: SIZES.topBarHeight + 10,
    zIndex: 10,
    left: 30,
    right: 30,
  },
  locationSearchInput: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 20,
    fontFamily: FONTS.Medium,
    width: "100%",
    fontSize: 17,
    marginTop: 20,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomBackdrop: {
    backgroundColor: COLORS.lightBlue,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    left: 15,
    right: 15,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    paddingBottom: SIZES.bottomBarHeight + 10,
  },
  topBackdrop: {
    backgroundColor: COLORS.lightRed,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    position: "absolute",
    top: 0,
    zIndex: 10,
    left: 15,
    right: 15,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 20,
    paddingTop: SIZES.topBarHeight + 10,
  },
  startButton: {
    backgroundColor: COLORS.blue,
    borderRadius: SIZES.height,
    marginLeft: 10,
    width: "100%",
    alignItems: "center",
  },
  exitButton: {
    backgroundColor: COLORS.red,
    borderRadius: SIZES.height,
    marginLeft: 10,
    marginTop: 5,
    width: "100%",
    alignItems: "center",
  },
  difficultyButton: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: SIZES.height,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  startButtonText: {
    fontFamily: FONTS.Medium,
    fontSize: 16,
    color: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonControlsContainer: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
