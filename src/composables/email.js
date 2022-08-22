import { computed, ref } from 'vue'

export function useEmail() {
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

  return { emailAddress, emailOptions }
}
