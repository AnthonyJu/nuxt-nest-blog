<template>
  <div full flex-center flex-wrap>
    <div h-full min-w-500px flex-col-center>
      <div
        class="text-$el-color-info"
        mb-15px animate-head-shake text-55px
      >
        401
      </div>

      <div
        class="text-$el-text-color-primary"
        mb-10px animate-head-shake text-22px
      >
        {{ t('pages.401.not-authorized') }}
      </div>

      <div
        class="text-$el-text-color-secondary"
        mb-30px animate-head-shake text-12px
      >
        {{ t('pages.401.not-authorized-message') }}
      </div>

      <div animate-head-shake>
        <el-button
          type="warning"
          round
          @click="userStore.handleLogout()"
        >
          {{ t('pages.401.reauthorize') }}
        </el-button>
      </div>
    </div>

    <div ml-40px animate-head-shake>
      <img class="full dark:turn-dark" src="@/assets/401.png">
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: none
</route>

<script setup lang="ts">
const { t } = useI18n()
const userStore = useUserStore()
</script>
