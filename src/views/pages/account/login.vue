<script>
import { required } from "vuelidate/lib/validators";
import appConfig from "@/app.config";

import { Diamond } from "vue-loading-spinner";
/**
 * Login component
 */
export default {
  components: { Diamond },
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      userName: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    };
  },
  validations: {
    userName: {
      required,
    },
    password: {
      required,
    },
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    notificationAutoCloseDuration() {
      return this.$store && this.$store.state.notification ? 5 : 0;
    },
  },
  mounted() {
    document.body.classList.add("authentication-bg");
    document.getElementById("showload").style.display = "none";
  },
  methods: {
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
          const { userName, password } = this;    
          if (userName && password) {
            // this.$store.dispatch("authfack/login", {
            //   userName,
            //   password,
            // });
             const itemvalues = {
                        UserName: userName,
                        Password: password
                    }
            document.getElementById("showload").style.display = "block";
                    fetch("http://192.168.3.55/shipping/Login/PostLogin", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify(itemvalues)
                    })
                        .then(res => res.json())
                        .then((res) => {
                            if (res.rcode === 100) {
                                let responseJson = {
                                    id: res.Internalid,
                                    name: res.fullName,
                                    token: res.token
                                };
                                localStorage.setItem('user', JSON.stringify(responseJson));
                                this.$router.push({
                                  path: "/",
                                });
                                document.getElementById("showload").style.display = "none";
                            } else {
                              this.isAuthError = true;
                              this.authError = "These credentials do not match our records.";
                              
                               // console.log('These credentials do not match our records.');
                                document.getElementById("showload").style.display = "none";
                            }
                        })
                        .catch((error) => {
                            this.isAuthError = true;
                              this.authError = "Serer Error:" + error;
                            document.getElementById("showload").style.display = "none";
                        });
          }
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <router-link to="/" class="text-dark">
        <i class="mdi mdi-home-variant h2"></i>
      </router-link>
    </div>
    <div class="account-pages my-5 pt-sm-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
              <router-link to="/" class="mb-5 d-block auth-logo">
                <img
                  src="@/assets/images/MAILogo.png"
                  alt
                  height="50"
                  class="logo logo-dark"
                />
                <img
                  src="@/assets/images/MAILogo.png"
                  alt
                  height="50"
                  class="logo logo-light"
                />
              </router-link>
            </div>
          </div>
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p class="text-muted">Sign in to continue to MAI.</p>
                </div>
                <div class="p-2 mt-4">
                  <b-alert
                    v-model="isAuthError"
                    variant="danger"
                    class="mt-3"
                    dismissible
                    >{{ authError }}</b-alert
                  >

                  <div
                    v-if="notification.message"
                    :class="'alert ' + notification.type"
                  >
                    {{ notification.message }}
                  </div>

                  <b-form @submit.prevent="tryToLogIn">
                    <b-form-group
                      id="input-group-1"
                      class="mb-3"
                      label="User Name"
                      label-for="input-1"
                    >
                      <b-form-input
                        id="input-1"
                        v-model="userName"
                        type="text"
                        placeholder="Enter User Name"
                        :class="{ 'is-invalid': submitted && $v.userName.$error }"
                      ></b-form-input>
                      <div
                        v-if="submitted && $v.userName.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="!$v.userName.required"
                          >UserName is required.</span
                        >
                      </div>
                    </b-form-group>

                    <b-form-group id="input-group-2" class="mb-3">
                      <label for="input-2">Password</label>
                      <b-form-input
                        id="input-2"
                        v-model="password"
                        type="password"
                        placeholder="Enter password"
                        :class="{
                          'is-invalid': submitted && $v.password.$error,
                        }"
                      ></b-form-input>
                      <div
                        v-if="submitted && !$v.password.required"
                        class="invalid-feedback"
                      >
                        Password is required.
                      </div>
                    </b-form-group>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="auth-remember-check"
                      />
                      <label class="form-check-label" for="auth-remember-check"
                        >Remember me</label
                      >
                    </div>
                    <div class="mt-3 text-end">
                      <diamond style="float: left;margin-top: 13px;"  id="showload"></diamond>
                      <b-button type="submit" variant="primary" class="w-sm"
                        >Log In</b-button
                      >
                    </div>

                  </b-form>
                </div>
                <!-- end card-body -->
              </div>
              <!-- end card -->
            </div>
            <div class="mt-4 text-center">
              <p>
                © {{ new Date().getFullYear() }} Marketing Alternatives Inc.
              </p>
            </div>
            <!-- end row -->
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" module></style>
