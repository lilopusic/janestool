<script setup>
import { ref } from 'vue'
import axios from 'axios'
import fun from '../composables/confetti.js'
import { useEmail } from '../composables/email'

const { emailAddress, emailOptions } = useEmail()

const merging = ref(false)

const filesUpload = ref(null)

const files = ref([])

// const host = 'http://localhost:5000'
// const host = "http://23.105.223.132"
const host = 'https://secret-lowlands-59975.herokuapp.com'
function merge() {
  if (files.value.length === 0) {
    alert('请上传合并文件!')
    return
  }
  merging.value = true
  let uploadFiles = []
  uploadFiles = uploadFiles.concat(files.value)
  const form = new FormData()
  const configs = {
    headers: { 'Content-Type': 'multipart/form-data' },
  }
  uploadFiles.forEach(file => form.append('file', file))
  form.append('emailAddress', emailAddress.value)

  axios.post(`${host}/pdf-upload`, form, configs).then((res) => {
    merging.value = false
    fun()
    newWin(`${host}/getFile/${res.data}`)
  }).catch(() => {
    merging.value = false
    // CORS issue, do not know why, maybe heroku issue?
    if (emailAddress.value)
      alert('网络出现问题,请检查邮箱是否收到邮件!')
    else
      alert('网络出现问题,请尝试输入邮箱再次合并,将会发送到邮箱中!')
  })
}

function purge() {
  filesUpload.value.clear()
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
    PDF合并工具
  </n-h3>
  <n-space vertical>
    <n-input-group>
      <n-tag size="large" type="info" :bordered="false">
        将合并结果发至邮箱(可选)
      </n-tag>
      <n-auto-complete
        v-model:value="emailAddress"
        :input-props="{
          autocomplete: 'disabled',
        }"
        :options="emailOptions"
        placeholder="请输入邮箱..."
      />
    </n-input-group>
  </n-space>

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
