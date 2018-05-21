'use strict'

import React, { PureComponent } from 'react'
import {
  View,
  FlatList,
  Text,
  Alert,
  StyleSheet
} from 'react-native'

import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

import {
  CustomButton
} from '../components'

export default class OnlineTest extends PureComponent {
  constructor (props) {
    super(props)

    /*
      questions: array <
        object <
          _id: string,
          question: string,
          options: array <string * 4>,
          answer: enum(0, 1, 2, 3)
        > * n
      >,
      selections: array <number * questions.length>
    */
    this.state = {
      refreshing: false,
      questions: [],
      selections: []
    }
  }

  componentDidMount () {
    this.getQuestions()
  }

  render () {
    return (
      <View style={{
        flex: 1,
        backgroundColor: this.$screenBackgroundColor
      }}>
        <FlatList
          data={this.state.questions}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <View style={styles.questionsContainer}>
              <Text style={styles.question}>{index + 1}. {item.question}</Text>
              <RadioGroup
                color={this.$mainColor}
                activeColor={this.$mainColor}
                highlightColor='#fff'
                onSelect = {(selectionIndex, value) => this.setState((prevState, props) => {
                  prevState.selections.splice(index, 1, value)

                  return { selections: prevState.selections }
                })}
              >
                {
                  item.options.map((element, optionsIndex) => (
                    <RadioButton key={optionsIndex.toString()} value={optionsIndex} style={styles.optionsContainer}>
                      <Text style={styles.options}>{element}</Text>
                    </RadioButton>
                  ))
                }
              </RadioGroup>
            </View>
          )}
          ListFooterComponent={this.state.questions.length > 0 ? () => (
            <View style={{
              paddingTop: this.$verticalSpacingDistance,
              paddingBottom: this.$verticalSpacingDistance,
              paddingLeft: this.$horizontalSpacingDistance,
              paddingRight: this.$horizontalSpacingDistance
            }}>
               <CustomButton
                onPress={() => this.checkAnswer()}
                text={this.$i18n.t('onlineTest.checkAnswer')}
              />
            </View>
          ) : undefined}
          refreshing={this.state.refreshing}
          onRefresh={() => this.getQuestions()}
        />
      </View>
    )
  }

  initSelections () {
    let selections = []
    
    for (let i = 0; i < this.state.questions.length; ++i) {
      selections.push(null)
    }

    this.setState({ selections })
  }

  async checkAnswer () {
    let correctCounter = 0
    let { length } = this.state.questions

    for (let i = 0; i < length; ++i) {
      if (this.state.selections[i] === null) {
        Alert.alert(
          this.$i18n.t('onlineTest.checkAnswer'),
          this.$i18n.t('onlineTest.completeAllQuestions'),
          [{ text: this.$i18n.t('alert.confirm') }]
        )

        return
      }

      if (this.state.questions[i].answer === this.state.selections[i]) {
        ++correctCounter
      }
    }

    let response

    if (correctCounter / length >= .6) {
      response = (await this.$JSONAjax({
        method: 'post',
        url: '/user/passTheExam'
      })).data

      await this.props.screenProps.getHasPassedTheExam()

      Alert.alert(
        this.$i18n.t('onlineTest.checkAnswer'),
        this.$i18n.t('onlineTest.passTheTest'),
        [
          {
            text: this.$i18n.t('alert.confirm'),
            onPress: () => this.props.navigation.navigate('SavingsSituations', {
              title: this.$i18n.t('monthlySavingsSituations.title')
            })
          }
        ],
        {
          onDismiss: () => this.props.navigation.navigate('SavingsSituations', {
            title: this.$i18n.t('monthlySavingsSituations.title')
          })
        }
      )
    } else {
      Alert.alert(
        this.$i18n.t('onlineTest.checkAnswer'),
        this.$i18n.t('onlineTest.failedTheTest'),
        [{ text: this.$i18n.t('alert.confirm') }]
      )
    }
  }

  getQuestions () {
    this.setState({ refreshing: true }, async () => {
      const response = (await this.$JSONAjax({
        method: 'post',
        url: '/question/getQuestions'
      })).data
  
      if (response.statusCode === 100) {
        this.setState({ questions: response.result.questions })
  
        this.initSelections()
      }
  
      this.setState({ refreshing: false })
    })
  }
}

const styles = StyleSheet.create({
  questionsContainer: {
    backgroundColor: '#fff',
    padding: 12
  },
  question: {
    margin: 12,
    color: '#000',
    fontSize: 16
  },
  optionsContainer: {
    alignItems: 'flex-start'
  },
  options: {
    marginRight: 12,
    color: '#000',
    fontSize: 16,
    lineHeight: 19
  }
})
