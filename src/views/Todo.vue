<script setup>
import { ref, computed, toRaw } from "vue";
import collect from "collect.js";

const tasksStorage = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

const themeStorage = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : "dark";

const theme = ref(themeStorage);
const tasks = ref(tasksStorage);
const filter = ref("all");
const inputNewTask = ref("");

// init set theme to body
document.documentElement.className = theme.value;

const handleCheck = (idx, e) => {
  const isCompleted = e.target.checked;

  const newTasks = [...tasks.value].map((item, i) => {
    if (idx === i) {
      return {
        ...item,
        isCompleted,
      };
    }
    return { ...item };
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
  filter.value = newFilter;
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (inputNewTask.value === "") {
    return alert("judul aktivitas harus diisi");
  }

  const currentTasks = [...tasks.value];
  currentTasks.push({
    title: inputNewTask.value,
    createdAt: new Date(),
    isCompleted: false,
  });

  const sortByCreatedAt = collect(currentTasks).sortByDesc("createdAt");

  tasks.value = sortByCreatedAt;

  updateTaskStorage(sortByCreatedAt);

  inputNewTask.value = "";
};

const handleClear = (e) => {
  e.preventDefault();
  const currentTasks = [...tasks.value];

  const filtered = currentTasks.filter((item) => !item.isCompleted);

  tasks.value = filtered;

  updateTaskStorage(filtered);
};

const filterUncompletedTasks = computed(() => {
  const currentTasks = [...tasks.value];
  return currentTasks.filter((item) => !item.isCompleted);
});

const filterTasks = computed(() => {
  const currentTasks = [...tasks.value];

  if (filter.value === "active")
    return currentTasks.filter((item) => !item.isCompleted);
  if (filter.value === "completed") {
    return currentTasks.filter((item) => item.isCompleted);
  }

  return collect(currentTasks).sortByDesc("createdAt");
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
    <div class="w-full dark:bg-slate-900 bg-slate-100 min-h-screen pb-16">
      <div class="max-w-lg mx-auto">
        <section id="header" class="px-6 pb-8 pt-16">
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
          </form>
        </section>
        <section id="content" class="px-6 transform -translate-y-8">
          <div
            class="w-full dark:bg-slate-800 bg-slate-200 rounded-lg max-h-max min-h-[4rem]"
          >
            <label
              v-for="(task, index) in filterTasks"
              :key="index"
              class="px-3 py-5 border-b block cursor-pointer dark:text-slate-200 dark:border-slate-600 border-slate-500"
            >
              <div class="flex justify-between items-center">
                <div class="flex justify-start items-center gap-3">
                  <div>
                    <input
                      type="checkbox"
                      class="hidden"
                      @change="(event) => handleCheck(index, event)"
                    />
                    <vue-feather
                      v-if="task.isCompleted"
                      type="check-circle"
                      class="text-emerald-500"
                    ></vue-feather>
                    <vue-feather v-else type="circle"></vue-feather>
                  </div>
                  <div
                    :class="{ 'line-through': task.isCompleted }"
                    class="mb-1"
                  >
                    {{ task.title }}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    class="text-red-600 hover:text-red-700"
                    @click="(event) => handleRemove(index, event)"
                  >
                    <vue-feather type="trash"></vue-feather>
                  </button>
                </div>
              </div>
            </label>
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
