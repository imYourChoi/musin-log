import React from "react";
import { Text, StyleSheet } from "react-native";

const CustomText = (props) => {
  const newStyle = props.style
    ? [styles.defaultText, props.style]
    : styles.defaultText;
  return (
    <Text {...props} style={newStyle}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: "NotoSans_400Regular",
    fontSize: 16,
    color: "#333333",
  },
});

export default CustomText;
