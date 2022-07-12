<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'
import fun from '../composables/confetti.js'

const startRow = ref(3)
const maxCol = ref(50)
const sortCol = ref(1)
const emailAddress = ref('')

const emailOptions = computed(() => {
  return ['@qq.com', '@lenovo.com', '@163.com'].map((suffix) => {
    const prefix = emailAddress.value.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})

const merging = ref(false)

const templateUpload = ref(null)
const filesUpload = ref(null)
const template = ref(null)
const files = ref([])

// const host = ""
// const host = "http://23.105.223.132"
const host = 'https://secret-lowlands-59975.herokuapp.com'
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
  form.append('sortCol', sortCol.value)
  form.append('emailAddress', emailAddress.value)

  axios.post(`${host}/upload`, form, configs).then((res) => {
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
  <n-space vertical>
    <n-input-group>
      <n-input-group-label>从第几行开始合并,默认为三</n-input-group-label>
      <n-input-number v-model:value="startRow" :style="{ width: '100%' }" placeholder="请输入数字..." clearable />
    </n-input-group>
    <n-input-group>
      <n-input-group-label>合并的最大列数,默认为五十</n-input-group-label>
      <n-input-number v-model:value="maxCol" :style="{ width: '100%' }" placeholder="请输入数字..." clearable />
    </n-input-group>
    <n-input-group>
      <n-input-group-label>根据哪一列来排序,默认为一</n-input-group-label>
      <n-input-number v-model:value="sortCol" :style="{ width: '100%' }" placeholder="请输入数字..." clearable />
    </n-input-group>
    <n-input-group>
      <n-tag size="large" type="info" :bordered="false">
        将合并结果发至邮箱
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
