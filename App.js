// import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, Button, Switch, Keyboard } from 'react-native';
import { Picker } from '@react-native-community/picker';
import SegmentedControl from '@react-native-community/segmented-control';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";


// import styles
import inputStyles from './styles/input';
import {
  getCurrDataForUS, getCurrDataForState
} from './networking/covidApi';

// import components
import {
  AppContainer, SearchContainer, DataScrollView, SearchControlContainer, GetUpdatesContainer
} from './components/views';
import { AppTitleText, SearchControlLabelText, ErrorText } from './components/text';

// import data
import stateNames from './data/states';

export default function App() {
  // Component states
  const [searchStateSwitch, setSearchStateSwitch] = useState(false);
  const [stateIndex, setStateIndex] = useState(stateNames.findIndex(state =>
    state.name == 'Oregon'
  ));
  // const [dateIndex, setDateIndex] = useState(2);
  const [searchDate, setSearchDate] = useState(new Date());
  // const [enableDatePicker, setEnableDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [covidUsData, setCovidUsData] = useState(null);
  const [covidStateData, setCovidStateData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getCovidData = async (searchDate) => {
    // let data;
    setErrorMsg(null);

    let data;
    try {
      if (searchStateSwitch) {
        data = await getCurrDataForState(stateIndex, searchDate);
        setCovidStateData(data);
      } else {
        data = await getCurrDataForUS(searchDate);
        setCovidUsData(data);
      }

      if (!data) {
        throw new Error('Data not available');
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <AppContainer>
      {/* <StatusBar style="auto" /> */}

      <AppTitleText>
        COVID-19 Tracker for United States
      </AppTitleText>

      <SearchContainer>
        <SearchControlContainer>
          <SearchControlLabelText>Search by state?</SearchControlLabelText>
          <Switch
            value={searchStateSwitch}
            onValueChange={(value) => {
              setSearchStateSwitch(value);
            }}
          />
        </SearchControlContainer>

        {searchStateSwitch && <Picker
          selectedValue={stateNames[stateIndex].abbr}
          onValueChange={(_, index) => setStateIndex(index)}
        >
          {stateNames.map((state, index) =>
            <Picker.Item
              key={index}
              label={state.name}
              value={state.abbr} />
          )}
        </Picker>}

        {/* <SegmentedControl
          values={['Choose date', 'Yesterday', 'Current']}
          selectedIndex={dateIndex}
          onChange={event => {
            const selectedIndex = event.nativeEvent.selectedSegmentIndex;
            setDateIndex(selectedIndex);

            const date = new Date();
            switch (selectedIndex) {
              case 0:
                setEnableDatePicker(true);
                break;
              case 1: // yesterday
                setEnableDatePicker(false);
                date.setDate(date.getDate() - 1);
                setSearchDate(date);
                break;
              case 2: // current
                setEnableDatePicker(false);
                setSearchDate(date);
                break;
            }
          }}
        /> */}

        <SearchControlLabelText>
          Get updates for:
        </SearchControlLabelText>
        <GetUpdatesContainer>
          <Button
            title='Latest'
            onPress={() => {
              // setSearchDate(new Date());
              getCovidData(new Date());
            }}
            style={{ marginRight: 10 }}
          />
          <Button
            title='Yesterday'
            onPress={() => {
              let yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              // setSearchDate(yesterday);
              getCovidData(yesterday);
            }}
            style={{ marginRight: 10 }}
          />
          <Button
            title='Pick a date'
            onPress={() => {
              setShowDatePicker(true);
            }}
            style={{ marginRight: 10 }}
          />
        </GetUpdatesContainer>

        <DateTimePickerModal
          // maximumDate={new Date()}
          isVisible={showDatePicker}
          date={searchDate}
          onConfirm={(selectedDate) => {
            setSearchDate(selectedDate);
            getCovidData(selectedDate);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </SearchContainer>

      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

      <DataScrollView
        data={searchStateSwitch ? covidStateData : covidUsData}
      />
    </AppContainer>
  );
}
