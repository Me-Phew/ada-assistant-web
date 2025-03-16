<script setup lang="ts">
import featureQuotePrivacyPhotoFront from "@/assets/img/feature_quote_privacy_media_front.jpg";
import featureQuotePrivacyPhotoBack from "@/assets/img/feature_quote_privacy_media_back.jpg";
import featureQuotePrivacyAuthorPhoto from "@/assets/img/feature_quote_privacy_author.jpg";

import featureQuoteConfigurationPhotoFront from "@/assets/img/feature_quote_configuration_media_front.jpg";
import featureQuoteConfigurationPhotoBack from "@/assets/img/feature_quote_configuration_media_back.jpg";
import featureQuoteConfigurationAuthorPhoto from "@/assets/img/feature_quote_configuration_author.jpg";
</script>

<template>
  <div class="home-page">
    <HomeHero />
    <HomeIntegrations />
    <HomeFeatureQuote
      :photo-front="featureQuotePrivacyPhotoFront"
      photo-front-alt=""
      :photo-back="featureQuotePrivacyPhotoBack"
      photo-back-alt=""
      title="Pełna prywatność, zero śledzenia"
      description="Twój asystent działa tylko dla Ciebie – bez zbierania danych, analizowania rozmów czy
        przesyłania informacji do korporacji. Twoje komendy pozostają Twoje."
      quote="W końcu asystent, któremu mogę zaufać! Wiem, że moje rozmowy zostają tam, gdzie powinny –
        tylko u mnie."
      :author-photo="featureQuotePrivacyAuthorPhoto"
      author-photo-alt=""
      author-description="Kamil Gruca, sponsor kampanii na Kickstarterze"
    />
    <HomeFeatureQuote
      variant="right-secondary"
      :photo-front="featureQuoteConfigurationPhotoFront"
      photo-front-alt=""
      :photo-back="featureQuoteConfigurationPhotoBack"
      photo-back-alt=""
      title="Prosta konfiguracja, pełna personalizacja"
      description="Z łatwością skonfiguruj swojego asystenta głosowego i dostosuj go do swoich potrzeb. Niezależnie od tego, czy chcesz zmieniać ustawienia, czy sterować urządzeniami – wszystko dostępne jednym głosem."
      quote="Projektowanie z myślą o użytkownikach to klucz do sukcesu. Każdy element interfejsu jest przemyślany, aby było łatwo i przyjemnie z niego korzystać."
      :author-photo="featureQuoteConfigurationAuthorPhoto"
      author-photo-alt=""
      author-description="Marcin Dudek, Kierownik Produkcji"
    />
    <HomeMobileApp />
    <HomeQuoteTestimonial />
  </div>
</template>
