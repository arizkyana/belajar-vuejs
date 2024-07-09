<script setup>
import { ref, computed, toRaw } from "vue";

const tasksStorage = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

const filter = ref("all");
const tasks = ref(tasksStorage);
const inputNewTask = ref("");

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
  });

  tasks.value = currentTasks;

  updateTaskStorage(currentTasks);

  inputNewTask.value = "";
};

const filterUncompletedTasks = computed(() => {
  const _tasks = [...tasks.value];
  return _tasks.filter((item) => !item.isCompleted);
});

const filterTasks = computed(() => {
  const _tasks = [...tasks.value].sort();

  if (filter.value === "active")
    return _tasks.filter((item) => !item.isCompleted);
  if (filter.value === "completed") {
    return _tasks.filter((item) => item.isCompleted);
  }

  return _tasks;
});

function updateTaskStorage(tasks) {
  const toRaws = [...tasks].map((item) => toRaw(item));

  localStorage.setItem("tasks", JSON.stringify(toRaws));
}
</script>
<template>
  <div class="max-h-screen h-full overflow-y-auto overflow-x-hidden relative">
    <!-- <div class="bg-blue-600 h-[30vh] fixed top-0 left-0 w-full"></div> -->
    <div
      class="max-w-lg mx-auto bg-slate-900 min-h-screen top-0 left-[50%] pb-16"
    >
      <section id="header" class="px-6 pb-8 pt-16 bg-blue-500">
        <h1 class="text-3xl text-white">Mau ngapain hari ini?</h1>

        <form @submit="(event) => handleSubmit(event)" class="my-8">
          <div class="bg-gray-800 rounded-lg text-gray-200 p-5">
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
        <div class="w-full bg-slate-800 rounded-lg max-h-max min-h-[4rem]">
          <label
            v-for="(task, index) in filterTasks"
            :key="index"
            class="px-3 py-5 border-b block cursor-pointer text-slate-200 border-slate-600"
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
                <div class="mb-1">
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
              <div>{{ filterUncompletedTasks.length }} items left</div>
              <div>
                <button type="button" class="hover:text-slate-600">
                  Clear completed
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="filter" class="px-6">
        <div
          class="bg-slate-800 px-3 py-5 text-slate-20 font-bold text-slate-500 rounded-lg"
        >
          <div class="flex justify-center items-center gap-3">
            <button
              :class="{ 'text-blue-600 duration-100': filter === 'all' }"
              type="button"
              class="hover:text-blue-600 transition-all"
              @click="(event) => handleFilter('all', event)"
            >
              All
            </button>
            <button
              :class="{ 'text-blue-600 duration-100': filter === 'active' }"
              type="button"
              class="hover:text-blue-600 transition-all"
              @click="(event) => handleFilter('active', event)"
            >
              Active
            </button>
            <button
              :class="{ 'text-blue-600 duration-100': filter === 'completed' }"
              type="button"
              class="hover:text-blue-600 transition-all"
              @click="(event) => handleFilter('completed', event)"
            >
              Completed
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<style></style>
