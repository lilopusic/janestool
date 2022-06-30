<script setup>
import { ref } from 'vue'
import axios from 'axios'
import fun from '../composables/confetti.js'

const startRow = ref(3)
const maxCol = ref(50)
const merging = ref(false)

const templateUpload = ref(null)
const filesUpload = ref(null)
const template = ref(null)
const files = ref([])

// const host = ""
// const host = "http://23.105.223.132"
const host = 'https://secret-lowlands-59975.herokuapp.com'
let retryCount = 0
function merge() {
  if (template.value === null || files.value.length === 0) {
    alert('请选择模板和合并文件!')
    return
  }
  merging.value = true
  let uploadFiles = []
  uploadFiles.push(template.value)
  uploadFiles = uploadFiles.concat(files.value)
  const form = new FormData()
  const configs = {
    headers: { 'Content-Type': 'multipart/form-data' },
  }
  uploadFiles.forEach(file => form.append('file', file))

  form.append('startRow', startRow.value)
  form.append('maxCol', maxCol.value)

  axios.post(`${host}/upload`, form, configs).then((res) => {
    merging.value = false
    fun()
    newWin(`${host}/getFile/${res.data}`)
  }).catch(() => {
    merging.value = false
    // CORS issue, do not know why, maybe heroku issue?
    retryCount++
    console.log(`Retry ${retryCount} times`)
    merge()
  })
}

function purge() {
  templateUpload.value.clear()
  filesUpload.value.clear()
}

function templateChange(options) {
  template.value = options.file.file
}
function filesChange(options) {
  files.value = options.fileList.map(file => file.file)
}

/**
 * Use this avoid intercept by browser
 * window.open() maybe intercepted.
 */
function newWin(url) {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.click()
}
</script>

<template>
  <n-h3 class="text-center font-bold">
    Excel合并工具
  </n-h3>

  <n-tooltip placement="top-start" trigger="hover">
    <template #trigger>
      <n-input-number v-model:value="startRow" placeholder="请输入数字..." clearable />
    </template>
    从第几行开始合并,默认为三
  </n-tooltip>

  <n-tooltip placement="top-start" trigger="hover">
    <template #trigger>
      <n-input-number v-model:value="maxCol" placeholder="请输入数字..." clearable />
    </template>
    合并最大列数,默认为50
  </n-tooltip>

  <n-divider />

  <n-upload ref="templateUpload" :multiple="false" directory-dnd :default-upload="false" @change="templateChange">
    <n-upload-dragger>
      <n-text class="text-lg">
        上传模板文件到此处
      </n-text>
    </n-upload-dragger>
  </n-upload>
  <n-divider />
  <n-upload ref="filesUpload" multiple directory-dnd :max="100" :default-upload="false" @change="filesChange">
    <n-upload-dragger>
      <n-text class="text-lg">
        上传需要合并的文件到此处
      </n-text>
    </n-upload-dragger>
  </n-upload>
  <n-divider />
  <n-button-group>
    <n-button :loading="merging" @click="merge">
      合并
    </n-button>
    <n-button @click="purge">
      清空
    </n-button>
  </n-button-group>
</template>
