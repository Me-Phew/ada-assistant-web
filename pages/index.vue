<script setup lang="ts">
import featureQuotePrivacyAuthorPhoto from "@/assets/img/feature_quote_privacy_author.jpg";
import featureQuotePrivacyPhotoBack from "@/assets/img/feature_quote_privacy_media_back.jpg";
import featureQuotePrivacyPhotoFront from "@/assets/img/feature_quote_privacy_media_front.jpg";

import featureQuoteConfigurationAuthorPhoto from "@/assets/img/feature_quote_configuration_author.jpg";
import featureQuoteConfigurationPhotoBack from "@/assets/img/feature_quote_configuration_media_back.jpg";
import featureQuoteConfigurationPhotoFront from "@/assets/img/feature_quote_configuration_media_front.jpg";
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
      :title="$t('pages.home.featureQuotePrivacy.title')"
      :description="$t('pages.home.featureQuotePrivacy.description')"
      :quote="$t('pages.home.featureQuotePrivacy.quote')"
      :author-photo="featureQuotePrivacyAuthorPhoto"
      author-photo-alt=""
      :author-description="$t('pages.home.featureQuotePrivacy.authorDescription')"
    />
    <HomeFeatureQuote
      variant="right-secondary"
      :photo-front="featureQuoteConfigurationPhotoFront"
      photo-front-alt=""
      :photo-back="featureQuoteConfigurationPhotoBack"
      photo-back-alt=""
      :title="$t('pages.home.featureQuoteConfiguration.title')"
      :description="$t('pages.home.featureQuoteConfiguration.description')"
      :quote="$t('pages.home.featureQuoteConfiguration.quote')"
      :author-photo="featureQuoteConfigurationAuthorPhoto"
      author-photo-alt=""
      :author-description="$t('pages.home.featureQuoteConfiguration.authorDescription')"
    />
    <HomeMobileApp />
    <HomeQuoteTestimonial />
  </div>
</template>
