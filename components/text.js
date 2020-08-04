import React from 'react';
import { Text } from 'react-native';

function AppTitleText(props) {
  return (
    <Text style={{
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    }}>
      {props.children}
    </Text>
  );
}

function SearchControlLabelText(props) {
  return (
    <Text style={{
      marginRight: '5%',
      fontSize: 17,
      fontWeight: 'bold'
    }}>
      {props.children}
    </Text>
  );
}

function TimeStampText(props) {
  return (
    <Text
      style={{
        fontSize: 17,
        fontStyle: 'italic',
        // color: 'darkgray'
      }}>
      {props.children}
    </Text>
  );
}

function DataTitleText(props) {
  return (
    <Text
      style={{
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 5
      }}>
      {props.children}
    </Text>
  );
}

function DataText(props) {
  let { children, style: extraStyle } = props;
  return (
    <Text
      style={{ fontSize: 20, ...extraStyle }}>
      {children}
    </Text>
  );
}

function PlaceholderDataText(props) {
  return (
    <DataText
      style={{
        fontStyle: 'italic',
        color: 'darkgray'
      }}>
      {props.children}
    </DataText>
  );
}

function CategoryText(props) {
  let { children } = props;
  let words = children.split('-');

  return (
    <DataText style={{
      width: '40%',
      maxWidth: 175,
      marginRight: 15,
      color: 'gray',
      textTransform: 'capitalize'
    }}>
      {words.join(' ')}
    </DataText>
  );
}

function StrongText(props) {
  return (
    <DataText style={{ fontWeight: 'bold' }}>
      {props.children}
    </DataText>
  );
}

function DifferenceText(props) {
  if (!props.value) return null;

  let num = Number(props.value);
  let fontColor = num >= 0 ? 'green' : 'red';
  let sign = num >= 0 ? '+' : '-';

  return (
    <DataText style={{
      marginLeft: 5,
      color: fontColor
    }}>
      {`(${sign}${num})`}
    </DataText>
  );
}

function ErrorText(props) {
  return (
    <Text
      style={{
        textAlign: 'center',
        fontSize: 17,
        color: 'red'
      }}>
      {props.children}
    </Text>
  );
}

export {
  AppTitleText,
  SearchControlLabelText,
  DataTitleText,
  TimeStampText,
  DataText,
  PlaceholderDataText,
  CategoryText,
  StrongText,
  DifferenceText,
  ErrorText
};
