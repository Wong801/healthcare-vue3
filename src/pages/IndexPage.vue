<script setup>
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "src/stores/user-store";
import { useExcel } from "../composables/excel";

const userStore = useUserStore();
const excel = useExcel();

const columns = ref([
  {
    name: "title",
    label: "Title",
    field: "title",
    align: "center",
    sortable: true,
  },
  {
    name: "firstName",
    label: "First Name",
    field: "firstName",
    align: "center",
    sortable: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    field: "lastName",
    align: "center",
    sortable: true,
  },
]);

const pagination = ref({
  sortBy: "firstName",
  rowsPerPage: 20,
  page: 1,
  rowsNumber: 0,
});

const updateUsers = async (param) => {
  pagination.value = param.pagination;
  await fetchUsers(param.pagination.page);
};

const rows = ref([]);

const fetchUsers = async (page = 1) => {
  await userStore.fetchUsers(page - 1);
  rows.value = userStore.getUserList;
  pagination.value.rowsNumber = userStore.getMeta.total;
};

const doExport = (type) => {
  excel.exportDataFromJSON({
    data: type === "list" ? rows.value : [user.value],
    newFileName:
      type === "list"
        ? `Patients_page_${pagination.value.page}`
        : `Data Patient ${user.value.firstName} ${user.value.lastName}`,
  });
};

const user = computed(() => userStore.getUser);
const editedUser = ref(null);

const showDetail = async (props) => {
  if (!props.expand) await userStore.fetchUserDetail(props.row.id);
  props.expand = !props.expand;
};

onMounted(async () => {
  await fetchUsers();
});

const removeUser = async (id) => {
  await userStore.removeUser(id);
  await fetchUsers();
};

const editUser = async (id) => {
  await userStore.editUser(id, editedUser.value);
  await fetchUsers();
  isUserEdit.value = false;
};

const isUserEdit = ref(false);
const dense = ref(false);

const isAddUser = ref(false);

const newUser = ref({
  firstName: "",
  lastName: "",
  email: "",
});

const createUser = async () => {
  try {
    await userStore.addUser(newUser.value);
    await fetchUsers();
  } catch (error) {
    alert("Error");
  }
};
</script>

<template>
  <q-page>
    <q-table
      title="Patients"
      :rows="rows"
      :columns="columns"
      row-key="id"
      dark
      color="amber"
      v-model:pagination="pagination"
      :rows-per-page-options="[]"
      @request="updateUsers"
    >
      <template #top-right>
        <q-btn @click="doExport('list')">Export Data</q-btn>
        <q-btn @click="isAddUser = true" class="q-ml-md"
          >+ Add Patient Data</q-btn
        >
      </template>

      <template #header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              key="detail"
              size="sm"
              color="blue"
              round
              dense
              @click="showDetail(props)"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr
          v-show="props.expand"
          v-if="Object.keys(user).length"
          :props="props"
        >
          <q-td colspan="100%">
            <q-card class="text-left" tag="div" dark>
              <div class="flex justify-center">
                <q-img
                  :src="user.picture"
                  style="height: 120px; max-width: 120px; border-radius: 100%"
                  class="q-my-md"
                ></q-img>
              </div>
              <div class="column q-my-sm q-mx-md">
                <p class="text-center">Id: {{ user.id }}</p>
                <q-btn @click="doExport('user')" class="flex justify-center"
                  >Export Data</q-btn
                >
              </div>
              <div class="row justify-around">
                <q-card-section v-if="!isUserEdit" style="width: 40%">
                  <p class="text-h5">BioData</p>
                  <p>Title: {{ user.title }}</p>
                  <p>First Name: {{ user.firstName }}</p>
                  <p>Last Name: {{ user.lastName }}</p>
                  <p>Gender: {{ user.gender }}</p>
                  <p>Email: {{ user.email }}</p>
                  <p>
                    Date of Birth:
                    {{ new Date(user.dateOfBirth).toLocaleDateString() }}
                  </p>
                  <p>Phone: {{ user.phone }}</p>
                </q-card-section>
                <q-card-section v-else style="width: 40%">
                  <p class="text-h5">BioData</p>
                  <q-input
                    v-model="editedUser.title"
                    label="Title"
                    stack-label
                    :dense="dense"
                    dark
                    style="width: 100%"
                  />
                  <q-input
                    v-model="editedUser.firstName"
                    label="First Name"
                    stack-label
                    :dense="dense"
                    dark
                    style="width: 100%"
                  />
                  <q-input
                    v-model="editedUser.lastName"
                    label="Last Name"
                    stack-label
                    :dense="dense"
                    dark
                    style="width: 100%"
                  />
                  <q-select
                    v-model="editedUser.gender"
                    :options="['male', 'female']"
                    label="Gender"
                    dark
                    style="width: 100%"
                  />
                  <q-input
                    v-model="editedUser.email"
                    label="Email"
                    stack-label
                    :dense="dense"
                    dark
                    readonly
                    style="width: 100%"
                  />
                </q-card-section>
                <q-card-section style="width: 40%">
                  <div v-if="!isUserEdit">
                    <p class="text-h5">Address</p>
                    <p>Street: {{ user.location.street }}</p>
                    <p>City: {{ user.location.city }}</p>
                    <p>State: {{ user.location.state }}</p>
                    <p>Country: {{ user.location.country }}</p>
                  </div>
                  <div v-else>
                    <p class="text-h5">Address</p>
                    <q-input
                      v-model="editedUser.location.street"
                      label="Street"
                      stack-label
                      :dense="dense"
                      dark
                      style="width: 100%"
                    />
                    <q-input
                      v-model="editedUser.location.city"
                      label="City"
                      stack-label
                      :dense="dense"
                      dark
                      style="width: 100%"
                    />
                    <q-input
                      v-model="editedUser.location.state"
                      label="State"
                      stack-label
                      :dense="dense"
                      dark
                      style="width: 100%"
                    />
                    <q-input
                      v-model="editedUser.location.country"
                      label="Country"
                      stack-label
                      :dense="dense"
                      dark
                      style="width: 100%"
                    />
                  </div>
                  <q-btn
                    @click="
                      isUserEdit
                        ? editUser(editedUser.id)
                        : (isUserEdit = true);
                      editedUser = { ...user };
                    "
                    class="q-my-md"
                    >Edit Data</q-btn
                  >
                  <q-btn
                    v-if="isUserEdit"
                    @click="isUserEdit = false"
                    class="q-mx-md q-my-md"
                    >Cancel Editing</q-btn
                  >
                  <q-btn
                    @click="removeUser(user.id)"
                    class="q-my-md"
                    :class="{ 'q-mx-md': !isUserEdit }"
                    >Remove Patient</q-btn
                  >
                </q-card-section>
              </div>
            </q-card>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="isAddUser" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">First Name</div>
          <q-input
            dense
            v-model="newUser.firstName"
            autofocus
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">Last Name</div>
          <q-input
            dense
            v-model="newUser.lastName"
            autofocus
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6">Email</div>
          <q-input
            type="email"
            dense
            v-model="newUser.email"
            autofocus
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            @click="createUser"
            flat
            label="Add patient"
            :disabled="
              !newUser.firstName && !newUser.lastName && !newUser.email
            "
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
