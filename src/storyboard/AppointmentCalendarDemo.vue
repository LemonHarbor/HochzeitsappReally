// AppointmentCalendarDemo.vue
<template>
  <div class="p-8 bg-background">
    <appointment-calendar
      :appointments="sampleAppointments"
      :vendors="sampleVendors"
      @appointment-added="handleAddAppointment"
      @appointment-viewed="handleViewAppointment"
    />
  </div>
</template>

<script src="./AppointmentCalendarDemo.ts"></script>
