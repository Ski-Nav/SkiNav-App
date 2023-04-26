
import { Keyboard, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../../constants/constants";
import SelectDropdown from "../../DownloadedComponents/SelectDropdown";
import { FontAwesome } from "@expo/vector-icons";
import { formatError } from "../../../helpers/helpers";

interface CustomDropdownProps {
  setSelectedData: React.Dispatch<React.SetStateAction<any>>;
  data: any;
  displayProperty?: string;
  defaultText: string;
  defaultValue?:any;
}
const CustomDropdown = (props: CustomDropdownProps) => {
  if(!props.data){
    throw formatError("Dropdown Error", "Dropdown data is undefined")
  }
  return (
    <SelectDropdown
      data={props.data}
      defaultValue={props.defaultValue}
      onSelect={(selectedItem, index) => {
        props.setSelectedData(selectedItem);
      }}
      buttonTextAfterSelection={(selectedItem, index) => {
        // text represented after item is selected
        // if data array is an array of objects then return selectedItem.property to render after item is selected
        if (!selectedItem) {
          return "";
        }
        try {
          if (props.displayProperty) {
            return selectedItem[props.displayProperty];
          }
          return selectedItem;
        } catch {
          console.log("Got an error in dropdown");
          return "";
        }
      }}
      rowTextForSelection={(item, index) => {
        // text represented for each item in dropdown
        // if data array is an array of objects then return item.property to represent item in dropdown
        if (!item) {
          return "";
        }
        try {
          if (props.displayProperty) {
            return item[props.displayProperty];
          }
          return item;
        } catch {
          console.log("Got an error in dropdown");
          return "";
        }
      }}
      buttonStyle={{
        width: "100%",
        backgroundColor: COLORS.white,
        borderRadius: 15,
      }}
      defaultButtonText={props.defaultText}
      buttonTextStyle={{
        textAlign: "left",
        marginLeft: 10,
        fontFamily: FONTS.Medium,
        fontSize: 17,
      }}
      rowTextStyle={{
        textAlign: "left",
        marginLeft: 20,
        fontFamily: FONTS.Regular,
        fontSize: 17,
      }}
      rowStyle={{ flex: 1 }}
      dropdownStyle={{ borderRadius: 15 }}
      selectedRowTextStyle={{
        textAlign: "left",
        marginLeft: 20,
        fontFamily: FONTS.SemiBold,
        fontSize: 17,
      }}
      search={true}
      searchInputTxtStyle={{
        textAlign: "left",
        marginLeft: 5,
        fontFamily: FONTS.Medium,
        fontSize: 17
      }}
      searchInputStyle={{
        backgroundColor: COLORS.white,
        borderBottomWidth: 2,
        borderColor: COLORS.gray,
      }}
      searchPlaceHolder="Search"
      renderDropdownIcon={isOpened => {
        return <FontAwesome style={{marginRight: 10}} name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
      }}
    />
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({});
