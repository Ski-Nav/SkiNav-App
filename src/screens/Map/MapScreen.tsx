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
import { SkiNavigator } from "../../routing/SkiNavigator";
import { useNavigation } from "@react-navigation/native";
import { Edge } from "../../routing/edge";
import { Node } from "../../routing/node";
import {
  MapViewWithHeading,
  ArrowedPolyline,
} from "react-native-maps-line-arrow";

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

  const onStartPressed = () => {};

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

  const addArrowHeads = (
    line: [
      { latitude: number; longitude: number },
      { latitude: number; longitude: number }
    ],
    interval = .001,
    size = 0.0001
  ) => {
    const arrowLine = [];

    for (let i = 0; i < line.length - 1; i++) {
      const point1 = line[i];
      const point2 = line[i + 1];

      const dx = point2.latitude - point1.latitude;
      const dy = point2.longitude - point1.longitude;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);

      const splitSegment = (fraction) => ({
        latitude: point1.latitude + dx * fraction,
        longitude: point1.longitude + dy * fraction,
      });

      for (let j = 0; j < segmentLength; j += interval) {
        const startPoint = splitSegment(j / segmentLength);
        const midPoint = splitSegment((j + interval / 2) / segmentLength);
        const endPoint = splitSegment((j + interval) / segmentLength);

        const arrowPoint1 = {
          latitude: midPoint.latitude - dy * size,
          longitude: midPoint.longitude + dx * size,
        };

        const arrowPoint2 = {
          latitude: midPoint.latitude + dy * size,
          longitude: midPoint.longitude - dx * size,
        };

        arrowLine.push(
          startPoint,
          arrowPoint1,
          midPoint,
          arrowPoint2,
          endPoint
        );
      }
    }

    return arrowLine;
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

  useEffect(() => {
    console.log("REGION IS \n\n\n\n\n" + JSON.stringify(region));
  }, [region]);

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

  useEffect(() => {
    requestCurrentResort();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.locationSearchContainer}>
          <TextInput
            style={styles.locationSearchInput}
            placeholderTextColor={COLORS.gray}
            placeholder={"From..."}
          ></TextInput>
          <TextInput
            style={styles.locationSearchInput}
            placeholderTextColor={COLORS.gray}
            placeholder={"To..."}
          ></TextInput>
        </View>
        {graph && edges && nodes && region && (
          <MapView
            followsUserLocation={isRouting}
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
                const coordinates = addArrowHeads([
                  {
                    latitude: nodes[fromID].latitude,
                    longitude: nodes[fromID].longitude,
                  },
                  {
                    latitude: nodes[toID].latitude,
                    longitude: nodes[toID].longitude,
                  },
                ]);

                return (
                  <ArrowedPolyline
                    key={`${fromID}-${toID}`}
                    coordinates={coordinates}
                    strokeColor={getPolylineColor(edge)}
                    strokeWidth={1}
                    lineDashPattern={[0]}
                  />
                );
              });
            })}
          </MapView>
        )}
        <View style={styles.bottomBackdrop}>
          <Text style={{ fontFamily: FONTS.Medium, fontSize: 20 }}>
            Difficulty (select many)
          </Text>
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
