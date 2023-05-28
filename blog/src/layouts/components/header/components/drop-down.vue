<template>
  <label for="burger" class="burger relative">
    <input id="burger" v-model="show" type="checkbox">
    <span /><span /><span />
    <nav
      v-show="show"
      class="absolute right-0px top-30px w-80px flex-col-center gap-8px rounded bg-$bg-color py-10px shadow dark:shadow-gray-600"
    >
      <router-link
        v-for="item in list"
        :key="item.path"
        :to="item.path"
        class="hover:text-#c784ed dark:hover:text-#57f0e6"
        @click="delayCloseHandle"
      >
        {{ item.name }}
      </router-link>
    </nav>
  </label>
</template>

<script setup lang="ts">
interface ListItem {
  name: string
  path: string
}

defineProps<{ list: ListItem[] }>()

const show = ref(false)
function delayCloseHandle() {
  setTimeout(() => {
    show.value = false
  }, 60)
}
</script>

<style lang="scss" scoped>
.burger {
  position: relative;
  width: 27px;
  height: 20px;
  cursor: pointer;
  background: transparent;
}

.burger input {
  display: none;
}

.burger span {
  position: absolute;
  left: 0;
  display: block;
  width: 100%;
  height: 4px;
  background: var(--text-color);
  border-radius: 9px;
  opacity: 1;
  transition: .25s ease-in-out;
  transform: rotate(0deg);
}

.burger span:nth-of-type(1) {
  top: 0;
  transform-origin: left center;
}

.burger span:nth-of-type(2) {
  top: 50%;
  transform: translateY(-50%);
  transform-origin: left center;
}

.burger span:nth-of-type(3) {
  top: 100%;
  transform: translateY(-100%);
  transform-origin: left center;
}

.burger input:checked ~ span:nth-of-type(1) {
  top: 0;
  left: 6px;
  transform: rotate(45deg);
}

.burger input:checked ~ span:nth-of-type(2) {
  width: 0%;
  opacity: 0;
}

.burger input:checked ~ span:nth-of-type(3) {
  top: 19px;
  left: 6px;
  transform: rotate(-45deg);
}
</style>
