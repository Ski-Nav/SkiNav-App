import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { COLORS, FONTS, SIZES } from "../../constants/constants";
import { ResortContext } from "../../contexts/ResortContext";
import { ScreenContext } from "../../contexts/ScreenContext";
import { SkiNavigator } from "../../routing/models/SkiNavigator";
import { useNavigation } from "@react-navigation/native";
import { Edge } from "../../routing/models/edge";
import { Node } from "../../routing/models/node";
import { SafeAreaView } from "react-native-safe-area-context";
import MapCredentials from "./../../credentials/mapbox.json";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


MapboxGL.setAccessToken(MapCredentials.ACCESS_TOKEN);

const NavigationScreen = () => {
  const { setLoading } = useContext(ScreenContext);
  const [isRouting, setIsRouting] = useState(false);

  const [easySelected, setEasySelected] = useState(false);
  const [mediumSelected, setMediumSelected] = useState(false);
  const [hardSelected, setHardSelected] = useState(false);

  const skiNavigator = new SkiNavigator();
  const [graph, setGraph] = useState<{
    [fromId: string]: { [toId: string]: Edge };
  }>(null);
  const [nodes, setNodes] = useState<{ [id: string]: Node }>(null);
  const [edges, setEdges] = useState<{ [name: string]: Edge }>(null);
  const [region, setRegion] = useState<any>(null);

  const navigation = useNavigation<any>();
  const { currentResort } = useContext(ResortContext);

  const onStartPressed = () => {
    skiNavigator.requestGraph(currentResort).then(() => {
      const start = skiNavigator.getClosestNode(
        32.88122718312019,
        -117.23757547573618
      );
      const end = skiNavigator.getClosestNode(
        32.879347457165174,
        -117.23725798289574
      );
      console.log(
        skiNavigator.findAllShortestPath([start, end], new Set([0, 1]))
      );
    });
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

  const requestCurrentResort = async () => {
    await skiNavigator.requestGraph(currentResort);

    const graphData = skiNavigator.getGraph();
    const nodes = skiNavigator.getNodes();
    const edges = skiNavigator.getEdges();
    setNodes(nodes);
    setEdges(edges);
    setGraph(graphData);

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

    console.log(JSON.stringify(graphData));
  };

  const getPolylineColor = (edge: Edge) => {
    if (edge.edgeType !== "SLOPE") {
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

  useEffect(() => {
    requestCurrentResort();
  }, []);

  const RenderRoutingComponent = () => {
    return (
      <View></View>
    )
  }

  const RenderSelectRouteComponent = () => {
    return (
      <View style={styles.container}>
        <View style={styles.locationSearchContainer}>
          <TextInput
            style={styles.locationSearchInput}
            placeholderTextColor={COLORS.gray}
            placeholder={"From..."}
          />
          <TextInput
            style={styles.locationSearchInput}
            placeholderTextColor={COLORS.gray}
            placeholder={"To..."}
          />
        </View>
        {graph && edges && nodes && region && (
          <MapboxGL.MapView
            style={styles.map}
            styleURL={MapboxGL.StyleURL.Street}
          >
            <MapboxGL.Camera
              zoomLevel={10}
              centerCoordinate={[region.longitude, region.latitude]}
            />
            {Object.keys(graph).map((fromID) => {
              const edges = graph[fromID];
              return Object.keys(edges).map((toID) => {
                const edge = edges[toID];
                const coordinates = [
                  [nodes[fromID].getLongitude(), nodes[fromID].getLatitude()],
                  [nodes[toID].getLongitude(), nodes[toID].getLatitude()],
                ];
                const dx =
                  nodes[toID].getLongitude() - nodes[fromID].getLongitude();
                const dy =
                  nodes[toID].getLatitude() - nodes[fromID].getLatitude();
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                return (
                  <MapboxGL.ShapeSource
                    id={`${fromID}-${toID}`}
                    key={`${fromID}-${toID}`}
                    // shape={{
                    //   type: "Feature",
                    //   geometry: { type: "LineString", coordinates },
                    // }}
                  >
                    <MapboxGL.LineLayer
                      id={`${fromID}-${toID}-line`}
                      style={{
                        lineColor: getPolylineColor(edge),
                        lineWidth: 1,
                      }}
                    />
                    <MapboxGL.SymbolLayer
                      id={`${fromID}-${toID}-arrow`}
                      style={{
                        iconRotationAlignment: "map",
                        iconImage: "arrow-up",
                        iconRotate: angle,
                        iconSize: 0.6,
                      }}
                    />
                  </MapboxGL.ShapeSource>
                );
              });
            })}
          </MapboxGL.MapView>
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        {isRouting ? (
          <RenderRoutingComponent />
        ) : (
          <RenderSelectRouteComponent />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NavigationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    flex: 1,
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
