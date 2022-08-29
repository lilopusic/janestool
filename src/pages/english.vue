<script setup>
// Datasource is from https://apiv3.shanbay.com/weapps/dailyquote/quote/?date=2022-04-30
// Store at supabase
// Thanks to these open source projects.

import { format } from 'date-fns'
import { ref, watch } from 'vue'
import { TransitionPresets, useClipboard, useTransition } from '@vueuse/core'
import supabase from '../composables/supabase'
import fun from '../composables/confetti'
import similar from '../composables/similar'

const content = ref('')
const translation = ref('')

const { isSupported, copy } = useClipboard()

const inputTranslation = ref('')
const showAnswer = ref(false)
const fetching = ref(false)
const matchPercent = ref(0.0)
const tipRate = ref(0)

// Determine by showAnswer and tipRate
const anwserIndex = ref([])
const answer = ref([])

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
  answer.value = []
  anwserIndex.value = []
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
  if (showAnswer.value) { answer.value = translation.value.split('') }
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
    answer.value = strArr
  }
  anwserIndex.value = answer.value.map((_, index) => index)
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

function shuffleAnwser() {
  anwserIndex.value.sort(() => (Math.random() > 0.5 ? 1 : -1))
}
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
      <n-button @click="shuffleAnwser">
        Shuffle
      </n-button>
      <n-button v-show="!showAnswer" :disabled="showAnswer" @click="tipRate += 10">
        Help
      </n-button>
      <n-button v-show="isSupported && showAnswer" @click="copy(translation)">
        Copy
      </n-button>
      <n-button disabled>
        Matched: {{ matchPercentOutput.toFixed(0) }}%
      </n-button>
    </n-button-group>
    <!-- Answer area -->
    <div v-auto-animate class="flex flex-wrap sm:w-full md:w-1/3">
      <div
        v-for="(index) in anwserIndex"
        :key="index"
        class="
        flex justify-center text-center items-center
        w-8 h-8
        m-1
        shadow-sm
        rounded-sm
        bg-gray-400/25"
      >
        {{ answer[index] }}
      </div>
    </div>
  </n-space>
</template>

<style scoped>

</style>
