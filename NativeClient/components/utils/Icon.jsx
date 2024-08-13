import { View, Text } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";
import icons from "../../assets/icons.js";

const Icon = ({ name, height, width = height, colour }) => {
  const path = icons[name];

  return (
    <Svg height={height} width={width} viewBox="0 0 16 16" >
      <Path d={path} fill={colour}/>
    </Svg>
  );
};

export default Icon;
