<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg font-sans border-2 border-gray-400">
      
      <div v-if="!emailSent">
        <h1 class="text-xl font-normal mb-1 text-gray-800">Don't Worry !</h1>
        <h2 class="text-3xl font-bold mb-1 text-gray-900">Forgot Password?</h2>
        <p class="text-sm text-gray-500 mb-8">Enter your email to reset your password</p>

        <form @submit.prevent="handleReset">
          
          <div class="mb-8">
            <label for="email" class="block text-base font-medium text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="text"
              v-model="email"
              @blur="validateEmail" 
              @input="hasError = false"
              placeholder="Enter your registered email"
              class="w-full px-4 py-3 rounded-lg outline-none border transition duration-150"
              :class="hasError ? 'border-red-500 text-red-900 focus:border-red-500' : 'border-gray-300 focus:border-black'"
            />
            <p v-if="hasError" class="text-red-500 text-sm mt-2">
              Oops, this email address looks wrong!
            </p>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#5F9E43] hover:bg-[#4e8536] text-white text-lg font-semibold rounded-lg shadow-sm transition duration-150 mb-10"
          >
            Send Reset Link
          </button>
        </form>
      </div>

      <div v-else class="text-center py-4">
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold mb-2 text-gray-900">Check your mail</h2>
        <p class="text-sm text-gray-500 mb-8">
          We have sent password recovery instructions to your email.
        </p>
        <button 
          @click="emailSent = false; email = ''; hasError = false"
          class="text-sm text-gray-500 underline hover:text-gray-800 mb-8"
        >
          Try another email
        </button>
      </div>

      <div class="text-center text-gray-500 text-sm">
        Remember your password ?
        <a href="Signin" class="text-[#5F9E43] font-bold hover:text-[#4e8536]">Login</a>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      hasError: false,
      emailSent: false // Controls the view (Form vs Success Message)
    };
  },
  methods: {
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // If field is not empty AND pattern doesn't match
      if (this.email.length > 0 && !emailPattern.test(this.email)) {
        this.hasError = true;
      } else {
        this.hasError = false;
      }
    },
    handleReset() {
      this.validateEmail();

      if (this.hasError || !this.email) {
        return; // Stop if invalid or empty
      }

      // Simulate API call
      console.log("Reset link sent to:", this.email);
      
      // Switch to success view
      this.emailSent = true;
    }
  }
};
</script>