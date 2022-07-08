<script setup>
// Datasource is from https://apiv3.shanbay.com/weapps/dailyquote/quote/?date=2022-04-30
// Store at supabase
// Thanks to these open source projects.

import { createClient } from '@supabase/supabase-js'
import { format } from 'date-fns'
import { computed, ref } from 'vue'

const supabaseUrl = 'https://ldzvczkewdibfwvhqutn.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenZjemtld2RpYmZ3dmhxdXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTA1OTYxNjUsImV4cCI6MTk2NjE3MjE2NX0.FIg0tCVPd5AtHfCA0SYeiV0r0gyFETOwLbsyQjC5NXI'
const supabase = createClient(supabaseUrl, SUPABASE_KEY)

const content = ref('')
const translation = ref('')
const showAnswer = ref(false)
const fetching = ref(false)

function randomFetch() {
  showAnswer.value = false
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

function randomDate(start, end) {
  return format(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())), 'yyyy-MM-dd')
}

function speak() {
  const words = new SpeechSynthesisUtterance(content.value)
  window.speechSynthesis.speak(words)
}

randomFetch()

const answer = computed(() => showAnswer.value ? translation.value : '**************************************')
</script>

<template>
  <n-space vertical>
    <n-input v-model:value="content" disabled type="textarea" placeholder="Waiting..." />
    <n-input type="textarea" placeholder="Try to translate.." />

    <n-button-group>
      <n-button :loading="fetching" @click="randomFetch">
        One More
      </n-button>
      <n-button @click="speak">
        Speak
      </n-button>
      <n-button @click="showAnswer = !showAnswer">
        {{ !showAnswer ? 'Show Answer' : 'Hide Answer' }}
      </n-button>
    </n-button-group>
    <n-input
      v-model:value="answer"
      disabled
      type="textarea"
      placeholder="Waiting..."
    />
  </n-space>
</template>

<style scoped>

</style>
