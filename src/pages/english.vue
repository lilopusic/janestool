<script setup>
// Datasource is from https://apiv3.shanbay.com/weapps/dailyquote/quote/?date=2022-04-30
// Store at supabase
// Thanks to these open source projects.

import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'
import { ref, watch } from 'vue'
import { TransitionPresets, useTransition } from '@vueuse/core'

import fun from '../composables/confetti'
import similar from '../composables/similar'

const supabaseUrl = 'https://ldzvczkewdibfwvhqutn.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenZjemtld2RpYmZ3dmhxdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA1OTYxNjUsImV4cCI6MTk2NjE3MjE2NX0.FIg0tCVPd5AtHfCA0SYeiV0r0gyFETOwLbsyQjC5NXI'
const supabase = createClient(supabaseUrl, SUPABASE_KEY)

const content = ref('')
const translation = ref('')
const inputTranslation = ref('')
const showAnswer = ref(false)
const fetching = ref(false)
const matchPercent = ref(0.0)
const tipRate = ref(0)

// Determine by showAnswer and tipRate
const answer = ref('')

function randomFetch() {
  reset()
  fetching.value = true
  const date = randomDate(new Date(2017, 3, 1), new Date(2022, 6, 1))
  return supabase
    .from('dailyquote')
    .select('content, translation, author')
    .filter('date', 'eq', date)
    .limit(1)
    .then((result) => {
      fetching.value = false
      if (result.data.length > 0) {
        content.value = result.data[0].content
        translation.value = result.data[0].translation
      }
      else { randomFetch() }
    }).catch((err) => {
      fetching.value = false
      console.log(err)
    })
}

function reset() {
  showAnswer.value = false
  matchPercent.value = 0
  inputTranslation.value = ''
  tipRate.value = 0
}

function randomDate(start, end) {
  return format(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), 'yyyy-MM-dd')
}

function speak() {
  const words = new SpeechSynthesisUtterance(content.value)
  window.speechSynthesis.speak(words)
}

function palindrome(str) {
  return str.replace(/[`:_.~!@#$%^&*() \+ =<>?"{}|, \/ ;' \\ [ \] ·~！@#￥%……&*（）—— \+ ={}|《》？：“”【】、；‘’，。、]/g,
    '')
}
randomFetch()

watch([showAnswer, tipRate, translation], () => {
  if (showAnswer.value) { answer.value = translation.value }
  else {
    const length = translation.value.length
    const strArr = []
    for (let i = 0; i < length; i++)
      strArr.push('*')
    let showCharNumber = length * (tipRate.value / 100)
    showCharNumber = showCharNumber >= length ? length - 1 : showCharNumber
    for (let i = 0; i < showCharNumber; i++) {
      const index = Math.round(Math.random() * (length - 1))
      strArr[index] = translation.value[index]
    }
    answer.value = strArr.join('')
  }
}, { immediate: true })

const matchPercentOutput = useTransition(matchPercent, {
  duration: 500,
  transition: TransitionPresets.easeInOutCubic,
})
const minCorrectRate = 50
watch(inputTranslation, (value) => {
  const rate = similar(palindrome(value), palindrome(translation.value))
  matchPercent.value = rate
  if (rate > minCorrectRate)
    fun()
})
</script>

<template>
  <n-space vertical>
    <n-input v-model:value="content" readonly type="textarea" placeholder="Waiting..." />
    <n-input v-model:value="inputTranslation" type="textarea" placeholder="Try to translate.." />

    <n-button-group>
      <n-button :loading="fetching" @click="randomFetch">
        One More
      </n-button>
      <n-button @click="speak">
        Speak
      </n-button>
    </n-button-group>
    <n-button-group>
      <n-button @click="showAnswer = !showAnswer">
        {{ !showAnswer ? 'Show Answer' : 'Hide Answer' }}
      </n-button>
      <n-button @click="tipRate += 10">
        Help
      </n-button>
      <n-button disabled>
        Matched: {{ matchPercentOutput.toFixed(0) }}%
      </n-button>
    </n-button-group>
    <n-input
      v-model:value="answer"
      readonly
      type="textarea"
      placeholder="Waiting..."
    />
  </n-space>
</template>

<style scoped>

</style>
