// Pricing Tiers UI Component für LemonVows
// Diese Komponente stellt die Benutzeroberfläche für die Preisstufen dar

import { ref, computed, onMounted } from 'vue';
import pricingService from './pricing-service.js';
import FeatureAccessControl from './feature-access-control.js';

export default {
  name: 'PricingTiersUI',
  
  props: {
    showComparison: {
      type: Boolean,
      default: true
    },
    enableUpgrade: {
      type: Boolean,
      default: true
    },
    highlightedTier: {
      type: String,
      default: 'premium'
    }
  },
  
  setup(props) {
    // Reaktive Daten
    const tiers = ref([]);
    const currentTier = ref('');
    const comparison = ref(null);
    const loading = ref(true);
    const featureAccessControl = ref(null);
    
    // Beim Mounten der Komponente
    onMounted(async () => {
      // Preisstufen laden
      tiers.value = pricingService.getPricingTiers();
      
      // Aktuelle Preisstufe abrufen
      currentTier.value = pricingService.getCurrentTier();
      
      // Vergleichstabelle generieren, wenn erforderlich
      if (props.showComparison) {
        comparison.value = pricingService.getTierComparison();
      }
      
      // Feature Access Control initialisieren
      featureAccessControl.value = new FeatureAccessControl(pricingService);
      
      loading.value = false;
    });
    
    // Berechnete Eigenschaften
    const highlightedTierData = computed(() => {
      return tiers.value.find(tier => tier.id === props.highlightedTier) || null;
    });
    
    const isCurrentTierHighlighted = computed(() => {
      return currentTier.value === props.highlightedTier;
    });
    
    // Methoden
    const handleUpgrade = async (tierId) => {
      if (!props.enableUpgrade) return;
      
      // Upgrade durchführen
      const success = await pricingService.upgradeTier(tierId);
      
      if (success) {
        currentTier.value = tierId;
      }
    };
    
    const formatPrice = (price, currency, period) => {
      if (price === 0) return 'Kostenlos';
      
      return `${price.toFixed(2)} ${currency}/${period}`;
    };
    
    const hasFeatureAccess = (featureId) => {
      if (!featureAccessControl.value) return false;
      
      return featureAccessControl.value.hasAccess(featureId);
    };
    
    return {
      tiers,
      currentTier,
      comparison,
      loading,
      highlightedTierData,
      isCurrentTierHighlighted,
      handleUpgrade,
      formatPrice,
      hasFeatureAccess
    };
  },
  
  // WeWeb-spezifische Konfiguration
  weweb: {
    type: 'component',
    uiSchema: {
      ui:showComparison: {
        type: 'toggle',
        label: 'Vergleichstabelle anzeigen'
      },
      ui:enableUpgrade: {
        type: 'toggle',
        label: 'Upgrade-Funktionalität aktivieren'
      },
      ui:highlightedTier: {
        type: 'select',
        label: 'Hervorgehobene Preisstufe',
        options: [
          { label: 'Free', value: 'free' },
          { label: 'Basis', value: 'basis' },
          { label: 'Premium', value: 'premium' },
          { label: 'Deluxe', value: 'deluxe' }
        ]
      }
    }
  }
};
