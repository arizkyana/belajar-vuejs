<script setup>
import { ref, computed, toRaw } from "vue";
import { v1 } from "uuid";

const initTasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

const themeStorage = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : "dark";

const theme = ref(themeStorage);
const tasks = ref(initTasks);
const filter = ref("all");
const inputNewTask = ref("");

// init set theme to body
document.documentElement.className = theme.value;

const handleCheck = (element, e) => {
  const newTasks = [...tasks.value].map((item) => {
    if (element.id === item.id) {
      return {
        ...toRaw(element),
      };
    }
    return { ...toRaw(item) };
  });

  tasks.value = newTasks;

  updateTaskStorage(newTasks);
};

const handleRemove = (idx, e) => {
  e.stopPropagation();
  const newTasks = [...tasks.value];

  newTasks.splice(idx, 1);

  tasks.value = newTasks;

  updateTaskStorage(newTasks);
};

const handleFilter = (newFilter, e) => {
  e.preventDefault();

  const _taskStorage = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];

  if (_taskStorage.length > 0) {
    const currentTasks = [..._taskStorage];

    switch (newFilter) {
      case "active":
        tasks.value = currentTasks.filter((item) => !item.isCompleted);
        break;
      case "completed":
        tasks.value = currentTasks.filter((item) => item.isCompleted);
        break;
      default:
        tasks.value = currentTasks;
    }

    filter.value = newFilter;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (inputNewTask.value === "") {
    return alert("judul aktivitas harus diisi");
  }

  const currentTasks = [...tasks.value];

  currentTasks.push({
    id: v1(),
    title: inputNewTask.value,
    createdAt: new Date(),
    isCompleted: false,
  });

  tasks.value = currentTasks;

  updateTaskStorage(currentTasks);

  inputNewTask.value = "";
};

const handleClear = (e) => {
  e.preventDefault();
  const currentTasks = [...tasks.value];

  const filtered = currentTasks.filter((item) => !item.isCompleted);

  tasks.value = filtered;

  updateTaskStorage(filtered);
};

const handleMove = (e) => {
  // console.log("moving > ", e);
};

const handleDragChange = (e) => {
  // console.log("change > ", e);
  // const { oldIndex, newIndex } = e.moved;

  updateTaskStorage([...tasks.value]);
};

const filterUncompletedTasks = computed(() => {
  const currentTasks = [...tasks.value];
  return currentTasks.filter((item) => !item.isCompleted);
});

function updateTaskStorage(tasks) {
  const toRaws = [...tasks].map((item) => toRaw(item));

  localStorage.setItem("tasks", JSON.stringify(toRaws));
}

function toggleTheme() {
  document.documentElement.classList.remove(theme.value);

  const currentTheme = theme.value === "dark" ? "light" : "dark";
  theme.value = currentTheme;
  localStorage.setItem("theme", currentTheme);

  document.documentElement.classList.add(currentTheme);
}
</script>
<template>
  <div class="h-full overflow-y-auto overflow-x-hidden relative">
    <div class="w-full dark:bg-slate-900 bg-slate-50 min-h-screen pb-16">
      <div class="max-w-lg mx-auto">
        <section id="header" class="px-6 pt-16">
          <div class="flex justify-between items-center py-2">
            <h1 class="text-3xl dark:text-white font-semibold">
              Mau ngapain hari ini?
            </h1>
            <div>
              <button
                type="button"
                class="px-3 py-2 rounded-lg hover:bg-slate-700 hover:text-slate-400 dark:text-slate-300 flex justify-center items-center"
                @click="toggleTheme"
              >
                <vue-feather
                  :type="theme === 'dark' ? 'moon' : 'sun'"
                ></vue-feather>
              </button>
            </div>
          </div>
          <form @submit="(event) => handleSubmit(event)" class="my-8">
            <div
              class="dark:bg-slate-800 dark:border-0 border bg-slate-50 rounded-lg dark:text-gray-200 p-5"
            >
              <input
                v-model="inputNewTask"
                type="text"
                placeholder="Buat satu aktivitas baru..."
                class="bg-transparent w-full block outline-none"
                autofocus
              />
            </div>
            <div class="text-xs dark:text-slate-500 text-end py-1">
              Tekan enter untuk menyimpan aktivitas
            </div>
          </form>
        </section>
        <section id="content" class="px-6 pb-8">
          <div
            class="w-full dark:bg-slate-800 bg-slate-200 rounded-lg max-h-max min-h-[4rem]"
          >
            <draggable
              :list="tasks"
              item-key="title"
              class="list-group"
              ghost-class="ghost"
              @start="dragging = true"
              @end="dragging = false"
              :move="handleMove"
              @change="handleDragChange"
              :disabled="filter !== 'all'"
            >
              <template #item="{ element, index }">
                <label
                  :class="{ 'cursor-default': filter !== 'all' }"
                  class="px-3 dark:border-t-slate-800 dark:border-l-slate-800 dark:border-r-slate-800 dark:bg-slate-800 bg-slate-200 border-t-slate-200 border-r-slate-200 border-l-slate-200 py-5 border-b flex justify-between overflow-hidden items-center w-full cursor-pointer dark:text-slate-200 dark:border-slate-600 border-slate-500"
                >
                  <div
                    class="flex justify-start items-center flex-1 w-3/4 gap-3"
                  >
                    <div>
                      <input
                        :disabled="filter !== 'all'"
                        type="checkbox"
                        class="hidden"
                        v-model="element.isCompleted"
                        @change="(event) => handleCheck(element, event)"
                      />
                      <!-- @change="(event) => handleCheck(index, event)" -->
                      <vue-feather
                        v-if="element.isCompleted"
                        type="check-circle"
                        class="text-emerald-500"
                      ></vue-feather>
                      <vue-feather v-else type="circle"></vue-feather>
                    </div>
                    <div
                      :class="{ 'line-through': element.isCompleted }"
                      class="mb-1 overflow-hidden text-wrap whitespace-pre-line break-words w-full"
                    >
                      <p>{{ element.title }}</p>
                    </div>
                  </div>
                  <div class="flex justify-end items-center">
                    <button
                      :disabled="filter !== 'all'"
                      type="button"
                      :class="{
                        'text-slate-400 hover:text-slate-500': filter !== 'all',
                      }"
                      class="text-red-600 hover:text-red-700 rounded px-2 py-1 flex justify-center items-center"
                      @click="(event) => handleRemove(index, event)"
                    >
                      <vue-feather type="trash"></vue-feather>
                    </button>
                  </div>
                </label>
              </template>
            </draggable>
            <div class="px-3 py-5 text-slate-200">
              <div
                class="flex justify-between items-center text-sm text-slate-500"
              >
                <div>{{ filterUncompletedTasks.length }} kegiatan tersisa</div>
                <div>
                  <button
                    type="button"
                    class="hover:text-slate-600"
                    @click="handleClear"
                  >
                    Hapus yang sudah selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="filter" class="px-6">
          <div
            class="dark:bg-slate-800 px-3 py-5 text-slate-20 font-bold text-slate-500 rounded-lg"
          >
            <div class="flex justify-center items-center gap-3">
              <button
                :class="{ 'text-blue-600 duration-100': filter === 'all' }"
                type="button"
                class="hover:text-blue-600 transition-all"
                @click="(event) => handleFilter('all', event)"
              >
                Semua
              </button>
              <button
                :class="{ 'text-blue-600 duration-100': filter === 'active' }"
                type="button"
                class="hover:text-blue-600 transition-all"
                @click="(event) => handleFilter('active', event)"
              >
                Aktif
              </button>
              <button
                :class="{
                  'text-blue-600 duration-100': filter === 'completed',
                }"
                type="button"
                class="hover:text-blue-600 transition-all"
                @click="(event) => handleFilter('completed', event)"
              >
                Selesai
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<style></style>
