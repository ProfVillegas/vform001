<template>
  <v-data-table
    :headers="headers"
    :items="userData"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="edituserData.email"
                    label="E-mail"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="edituserData.psw"
                    :append-icon="show ? 'visibility' : 'visibility_off'"
                    :rules="[rules.required, rules.min]"
                    :type="show ? 'text' : 'password'"
                    name="passw"
                    label="use only text signs"
                    hint="At least 8 characters"
                    counter
                    @click:append="show = !show"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-slider
                    v-model="edituserData.satisfaction"
                    min="1"
                    max="10"
                    :label="label_stf.label"
                    :track-color="label_stf.color"
                    thumb-label="always"
                  ></v-slider>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-textarea
                    name="comments"
                    label="Comments"
                    hint="type here ..."
                    v-model="edituserData.comments"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-checkbox
                    v-model="edituserData.options"
                    value="sendcoupons"
                    label=" Send me monthly coupons"
                  >
                  </v-checkbox>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-checkbox
                    v-model="edituserData.options"
                    value="sendSpecial"
                    label="I want today's special"
                  >
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5"
            >Are you sure yoy want to delete this row?</v-card-title
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeDelete">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteConfirm"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="mr-2" @click="editItem(item)">edit</v-icon>
      <v-icon @click="deleteItem(item)">delete</v-icon>
    </template>
  </v-data-table>
</template>
<script>
import { FirebaseStorage } from "../firebase";
import UserDataService from "../services/UserDataService";

export default {
  data() {
    return {
      userData: [],
      edituserData: {
        email: "",
        psw: "",
        satisfaction: 1,
        comments: "",
        options: [],
        image: "",
      },
      defaultuserData: {
        email: "",
        psw: "",
        satisfaction: 1,
        comments: "",
        options: [],
        image: "",
      },
      currentuserData: null,
      currentIndex: -1,
      unsubscribe: null,
      headers: [
        { text: "E-mail", value: "email" },
        { text: "satisfaction", value: "satisfaction" },
        { text: "Comments", value: "comments", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      show: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 Characters.",
        images: (value) =>
          !value ||
          value.size < 2000000 ||
          "Image size should be less than 2 MB!",
      },
      label_stf: {
        label: "Satisfaction",
        val: 10,
        color: "red",
      },
      dialog: false,
      dialogDelete: false,
    };
  },
  methods: {
    onDataChange(items) {
      let _userData = [];
      items.forEach((item) => {
        let id = item.id;
        let data = item.data();
        _userData.push({
          id: id,
          email: data.email,
          psw: data.psw,
          satisfaction: data.satisfaction,
          comments: data.comments,
          options: data.options,
          image: data.image,
        });
      });
      this.userData = _userData;
    },
    refreshList() {
      this.currentuserData = null;
      this.currentIndex = -1;
    },
    editItem(item) {
      //alert("Show Edit Modal");
      //this.currentIndex=this.userData.indexOf(item);
      this.edituserData = Object.assign({}, item);
      this.dialog = true;

      console.log(item);
    },
    deleteItem(item) {
      //alert("Show Delete Modal");
      this.edituserData = Object.assign({}, item);
      this.dialogDelete = true;
      console.log(item);
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.edituserData = Object.assign({}, this.defaultuserData);
        this.currentIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.edituserData = Object.assign({}, this.defaultuserData);
        this.currentIndex = -1;
      });
    },
    save() {
      const data = {
        email: this.edituserData.email,
        psw: this.edituserData.psw,
        satisfaction: this.edituserData.satisfaction,
        comments: this.edituserData.comments,
        options: this.edituserData.options,
      };
      UserDataService.update(this.edituserData.id, data)
        .then(() => {
          this.$emit("refreshList");
          this.close();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteConfirm() {
      UserDataService.delete(this.edituserData.id)
        .then(() => {
          this.$emit("refreshList");
          this.closeDelete();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getPicture(file) {
      return new Promise((resolve, reject) => {
        var startRef = FirebaseStorage.ref().child(file);

        startRef.getDownloadURL().then(function (url) {
          resolve(url);
        }).catch(function(error){
          reject(error);
        });
      });
    },
  },
  mounted() {
    this.unsubscribe = UserDataService.getAll()
      .orderBy("email", "asc")
      .onSnapshot(this.onDataChange);
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  computed: {
    formTitle() {
      return "Edit Item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
};
</script>
