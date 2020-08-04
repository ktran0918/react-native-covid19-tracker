import React from 'react';
import {
  View, ScrollView, KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

import {
  CategoryText, StrongText, DataTitleText, TimeStampText, DifferenceText, PlaceholderDataText
} from './text';
import { convertEtToUtc, parseData } from '../networking/covidApi';

function AppContainer(props) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        // behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{
          marginTop: 50,
          marginHorizontal: '5%',
        }}
      >
        {props.children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

function SearchContainer(props) {
  return (
    <View style={{
      // alignItems: 'center',
      width: '100%',
      marginTop: 20,
      padding: '2%',
      paddingBottom: 10,
      borderTopWidth: 1,
      borderTopColor: '#ccc'
    }}>
      {props.children}
    </View>
  );
}

function SearchControlContainer(props) {
  return (
    <View style={{
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10
    }}>
      {props.children}
    </View>
  );
}

function GetUpdatesContainer(props) {
  return (
    <View style={{
      flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: Platform.OS == 'android' ? 'space-between' : 'flex-start',
      marginTop: 5
    }}>
      {props.children}
    </View>
  );
}

function DataContainer(props) {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between'
    }}>
      {props.children}
    </View>
  );
}

function DataScrollView(props) {
  let { data } = props;
  if (!data) return null;

  if (data) {
    let parsed = parseData(data);
    let timeStamp;
    if (data.lastUpdateEt) {
      timeStamp = convertEtToUtc(data.lastUpdateEt).toLocaleString();
    } else {
      let date = String(data.date);
      let year = Number(date.slice(0, 4));
      let month = Number(date.slice(4, 6)) - 1; // Jan starts at 00
      let day = Number(date.slice(6));
      timeStamp = new Date(year, month, day);
    }

    return (
      <View
        style={{
          paddingVertical: '3%',
          paddingHorizontal: '2%',
          borderTopWidth: 1,
          borderTopColor: '#ccc'
        }}
      >
        <DataTitleText>
          {`Statistics for ${data.stateName || data.countryName}`}
        </DataTitleText>

        <TimeStampText>
          {`On ${timeStamp.toLocaleString()}`}
        </TimeStampText>

        <ScrollView
          contentContainerStyle={{
            alignItems: 'flex-start',
            marginTop: 10
          }}
        >
          {Object.keys(parsed).map((category, index) => {
            let { value, difference } = parsed[category];

            return (
              <DataContainer key={index}>
                <CategoryText>{category}</CategoryText>

                {value && <StrongText>{value}</StrongText>}
                {value && <DifferenceText value={difference} />}

                {!value && <PlaceholderDataText>Not available</PlaceholderDataText>}
              </DataContainer>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}


export {
  AppContainer, SearchContainer, SearchControlContainer, GetUpdatesContainer, DataContainer, DataScrollView
};
