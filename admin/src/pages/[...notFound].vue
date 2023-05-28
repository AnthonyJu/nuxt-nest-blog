<template>
  <div full flex-center flex-wrap>
    <div h-full min-w-500px flex-col-center>
      <div
        class="text-$el-color-info"
        mb-15px animate-head-shake text-56px
      >
        404
      </div>

      <div
        class="text-$el-text-color-primary"
        mb-10px animate-head-shake text-22px
      >
        {{ t('pages.404.page-not-found') }}
      </div>

      <div
        class="text-$el-text-color-secondary"
        mb-30px animate-head-shake text-12px
      >
        {{ t('pages.404.page-not-found-message') }}
      </div>

      <div animate-head-shake>
        <el-button
          type="primary"
          round
          @click="router.replace('/')"
        >
          {{ t('pages.404.back-to-home') }}
        </el-button>
      </div>
    </div>

    <div ml-40px animate-head-shake>
      <img class="full dark:turn-dark" src="@/assets/404.png">
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: none
</route>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()
</script>
