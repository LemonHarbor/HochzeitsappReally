<template>
  <div class="p-8 bg-background">
    <h1 class="text-2xl font-bold mb-6">Contract Management Demo</h1>
    <p class="text-muted-foreground mb-6">
      This demo shows the contract management functionality for wedding vendors. You can add, view, and manage vendor contracts with expiration tracking and key terms.
    </p>

    <div v-if="sampleContracts.length > 0" class="mb-6">
      <div class="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
        <div class="flex items-center">
          <span class="text-amber-700 font-medium">Ablaufende Verträge</span>
          <span class="ml-2 bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium">
            {{ expiringContracts.length }}
          </span>
        </div>
        <p class="text-amber-700 text-sm mt-1">
          Sie haben {{ expiringContracts.length }} Verträge, die in den nächsten 30 Tagen ablaufen.
        </p>
        <div v-if="expiringContracts.length > 0" class="mt-2 space-y-2">
          <div v-for="contract in expiringContracts" :key="contract.id" class="flex justify-between items-center">
            <span class="text-sm">{{ contract.name }}</span>
            <button 
              @click="handleViewContract(contract.file_url)"
              class="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded"
            >
              Anzeigen
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="tabs">
      <div class="tab-list mb-6">
        <button 
          @click="setActiveTab('contracts')" 
          :class="['tab', activeTab === 'contracts' ? 'active-tab' : '']"
        >
          Contract List
        </button>
        <button 
          @click="setActiveTab('form')" 
          :class="['tab', activeTab === 'form' ? 'active-tab' : '']"
        >
          Contract Form
        </button>
      </div>

      <div v-if="activeTab === 'contracts'" class="card">
        <div class="card-header">
          <h3 class="card-title">Vendor Contracts</h3>
        </div>
        <div class="card-content">
          <div class="space-y-4">
            <div v-for="contract in sampleContracts" :key="contract.id" class="border rounded-md p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium">{{ contract.name }}</h4>
                  <p class="text-sm text-gray-500">
                    {{ contract.signed_date ? new Date(contract.signed_date).toLocaleDateString() : 'Nicht unterzeichnet' }}
                    <span v-if="contract.expiration_date"> - Läuft ab am {{ new Date(contract.expiration_date).toLocaleDateString() }}</span>
                  </p>
                </div>
                <span 
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    contract.status === 'active' ? 'bg-green-100 text-green-800' :
                    contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                    contract.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ contract.status }}
                </span>
              </div>
              <div v-if="contract.key_terms" class="mt-2">
                <h5 class="text-sm font-medium">Key Terms:</h5>
                <div class="grid grid-cols-2 gap-2 mt-1">
                  <div v-for="(value, key) in contract.key_terms" :key="key" class="text-xs">
                    <span class="font-medium">{{ key }}:</span> {{ value }}
                  </div>
                </div>
              </div>
              <div class="mt-3 flex justify-end space-x-2">
                <button 
                  v-if="contract.file_url"
                  @click="handleViewContract(contract.file_url)"
                  class="px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'form'" class="card">
        <div class="card-header">
          <h3 class="card-title">Add/Edit Contract</h3>
        </div>
        <div class="card-content">
          <form @submit.prevent="handleFormSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Contract Name</label>
              <input type="text" class="w-full p-2 border rounded" placeholder="Enter contract name" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <select class="w-full p-2 border rounded">
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Signed Date</label>
              <input type="date" class="w-full p-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Expiration Date</label>
              <input type="date" class="w-full p-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Notes</label>
              <textarea class="w-full p-2 border rounded" rows="3"></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button 
                type="button" 
                @click="handleFormCancel"
                class="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./ContractManagementDemo.ts"></script>

<style scoped>
.card {
  @apply bg-white rounded-lg shadow-sm border;
}
.card-header {
  @apply p-4 border-b;
}
.card-title {
  @apply text-lg font-semibold;
}
.card-content {
  @apply p-4;
}
.tabs {
  @apply w-full;
}
.tab-list {
  @apply flex border-b;
}
.tab {
  @apply px-4 py-2 text-sm font-medium;
}
.active-tab {
  @apply border-b-2 border-blue-500 text-blue-600;
}
</style>
