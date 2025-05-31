<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useUrl } from "~/composables/register";

defineProps<{
  animationComplete: boolean;
}>();

interface Message {
  id: string;
  content: string;
  type: string;
  timestamp: string;
  conversationId?: string;
  audioPath?: string | null;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: string;
  messages?: Message[];
  previewMessage?: string;
}

const conversations = ref<Conversation[]>([]);
const selectedConversation = ref<Conversation | null>(null);
const isLoading = ref(true);
const hasError = ref(false);
const showConversationModal = ref(false);

const fetchConversations = async () => {
  isLoading.value = true;
  hasError.value = false;

  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found");
      hasError.value = true;
      return;
    }

    const response = await $fetch("conversations", {
      method: "GET",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("User conversations response:", response);

    if (Array.isArray(response)) {
      conversations.value = response;
    } else if (response.conversations) {
      conversations.value = response.conversations;
    } else if (response.data) {
      conversations.value = Array.isArray(response.data) ? response.data : [response.data];
    } else {
      conversations.value = [];
    }

    for (const conversation of conversations.value) {
      if (!conversation.messages || conversation.messages.length === 0) {
        try {
          const details = await fetchConversationDetails(conversation.id);
          if (details && details.messages && details.messages.length > 0) {
            conversation.previewMessage = details.messages[0].content;
            if (!conversation.timestamp && details.messages[0].timestamp) {
              conversation.timestamp = details.messages[0].timestamp;
            }
          }
        } catch (error) {
          console.error(`Failed to pre-fetch details for conversation ${conversation.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    hasError.value = true;
    conversations.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchConversationDetails = async (conversationId: string) => {
  try {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return null;
    }

    console.log(`Fetching details for conversation ${conversationId}`);

    const response = await $fetch(`/conversations/${conversationId}`, {
      method: "GET",
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.error(`Failed to fetch conversation details for ${conversationId}:`, error);
    return null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return "Invalid date";
  }
};

const formatLastActive = (dateString) => {
  if (!dateString) return "Never";

  try {
    const lastDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - lastDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day(s) ago`;

    return lastDate.toLocaleDateString();
  } catch (e) {
    return "Unknown";
  }
};

const getMessagePreview = (conversation) => {
  if (conversation.previewMessage) {
    return conversation.previewMessage.length > 60
      ? conversation.previewMessage.substring(0, 60) + "..."
      : conversation.previewMessage;
  }

  if (conversation.messages && conversation.messages.length > 0) {
    const userMessage = conversation.messages.find((msg) => msg.type === "user");
    if (userMessage && userMessage.content) {
      return userMessage.content.length > 60
        ? userMessage.content.substring(0, 60) + "..."
        : userMessage.content;
    }

    return conversation.messages[0].content.length > 60
      ? conversation.messages[0].content.substring(0, 60) + "..."
      : conversation.messages[0].content;
  }

  if (conversation.lastMessage) {
    return conversation.lastMessage;
  }

  return "No messages";
};

const formatConversationTitle = (conversation) => {
  if (conversation.title) return conversation.title;

  const idSubstring = conversation.id.substring(0, 8);
  return `Conversation ${idSubstring}`;
};

const getMessageCount = (conversation) => {
  if (conversation.messages && conversation.messages.length > 0) {
    return conversation.messages.length;
  }
  return 0;
};

const viewConversationDetails = async (conversation) => {
  try {
    const details = await fetchConversationDetails(conversation.id);
    if (details) {
      selectedConversation.value = {
        ...conversation,
        ...details,
        messages: details.messages || [],
      };
    } else {
      selectedConversation.value = { ...conversation, messages: [] };
    }
    showConversationModal.value = true;
  } catch (error) {
    console.error("Error fetching conversation details:", error);
  }
};

const closeConversationModal = () => {
  showConversationModal.value = false;
  selectedConversation.value = null;
};

const sortedConversations = computed(() => {
  return [...conversations.value].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return dateB - dateA;
  });
});

onMounted(() => {
  fetchConversations();
});
</script>

<template>
  <section
    class="conversation-history"
    :class="{ 'conversation-history--loaded': animationComplete }"
  >
    <div class="conversation-history__header">
      <h2 class="conversation-history__title">
        <Icon
          name="mdi:message-text"
          class="conversation-history__title-icon"
        />
        Conversation History
      </h2>
    </div>

    <!-- Content container -->
    <div class="conversation-history__content">
      <!-- Loading state -->
      <div
        v-if="isLoading"
        class="conversation-history__loading"
      >
        <Icon
          name="mdi:loading"
          class="conversation-history__loading-icon"
        />
        <p>Loading your conversations...</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="hasError"
        class="conversation-history__empty"
      >
        <p>Could not load conversations. Please try again.</p>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="conversations.length === 0"
        class="conversation-history__empty"
      >
        <div class="conversation-history__empty-icon">
          <Icon name="mdi:message-off" />
        </div>
        <h3 class="conversation-history__empty-title">No conversations yet</h3>
        <p class="conversation-history__empty-text">
          Start interacting with your assistant to see your conversation history.
        </p>
      </div>

      <!-- Conversations list -->
      <div
        v-else
        class="conversation-history__list"
      >
        <div
          v-for="conversation in sortedConversations"
          :key="conversation.id"
          class="conversation-history__item"
          @click="viewConversationDetails(conversation)"
        >
          <div class="conversation-history__icon">
            <Icon name="mdi:message-text-outline" />
          </div>
          <div class="conversation-history__info">
            <div class="conversation-history__name">
              {{ formatConversationTitle(conversation) }}
            </div>
            <div class="conversation-history__preview">
              {{ getMessagePreview(conversation) }}
            </div>
          </div>
          <div class="conversation-history__time">
            {{ formatLastActive(conversation.timestamp) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Conversation details modal -->
    <Teleport to="body">
      <div
        v-if="showConversationModal && selectedConversation"
        class="conversation-history__modal-overlay"
        @click="closeConversationModal"
      >
        <div
          class="conversation-history__modal"
          @click.stop
        >
          <div class="conversation-history__modal-header">
            <h3 class="conversation-history__modal-title">
              {{ formatConversationTitle(selectedConversation) }}
            </h3>
            <button
              class="conversation-history__modal-close"
              @click="closeConversationModal"
            >
              <Icon
                name="mdi:close"
                class="conversation-history__modal-close-icon"
              />
            </button>
          </div>

          <div class="conversation-history__modal-body">
            <div class="conversation-history__conversation">
              <div class="conversation-history__messages">
                <div
                  v-if="
                    !selectedConversation.messages || selectedConversation.messages.length === 0
                  "
                  class="conversation-history__empty-messages"
                >
                  No messages in this conversation
                </div>

                <div
                  v-else
                  v-for="message in selectedConversation.messages"
                  :key="message.id"
                  class="conversation-history__message"
                  :class="{
                    'conversation-history__message--user': message.type === 'user',
                    'conversation-history__message--assistant': message.type === 'assistant',
                  }"
                >
                  <!-- For user messages (left side) -->
                  <template v-if="message.type === 'user'">
                    <div
                      class="conversation-history__message-bubble conversation-history__message-bubble--user"
                    >
                      <div class="conversation-history__message-content">{{ message.content }}</div>
                      <div class="conversation-history__message-time">
                        {{ formatDate(message.timestamp) }}
                      </div>
                    </div>
                  </template>

                  <!-- For assistant messages (right side) -->
                  <template v-else>
                    <div
                      class="conversation-history__message-bubble conversation-history__message-bubble--assistant"
                    >
                      <div class="conversation-history__message-content">{{ message.content }}</div>
                      <div class="conversation-history__message-time">
                        {{ formatDate(message.timestamp) }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="conversation-history__details">
              <div class="conversation-history__detail-row">
                <div class="conversation-history__detail-label">Conversation ID</div>
                <div
                  class="conversation-history__detail-value conversation-history__detail-value--id"
                >
                  {{ selectedConversation.id }}
                </div>
              </div>

              <div class="conversation-history__detail-row">
                <div class="conversation-history__detail-label">Started</div>
                <div class="conversation-history__detail-value">
                  {{ formatDate(selectedConversation.timestamp) }}
                </div>
              </div>

              <div class="conversation-history__detail-row">
                <div class="conversation-history__detail-label">Messages</div>
                <div class="conversation-history__detail-value">
                  {{ getMessageCount(selectedConversation) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/global/variables/card_styles" as *;

.conversation-history {
  border-radius: $dark_card_border_radius;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  :root.light-theme & {
    background-color: $light_card_bg;
    box-shadow: $light_card_shadow;
    border: $light_card_border;
  }

  :root.dark-theme & {
    background-color: $dark_card_bg;
    box-shadow: $dark_card_shadow, $dark_card_glow;
    border: $dark_card_border;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid;

    :root.light-theme & {
      border-color: $light_header_border;
    }

    :root.dark-theme & {
      border-color: $dark_header_border;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0;
    font-size: 1.8rem;
    font-weight: 600;
    color: $color_text_primary;
  }

  &__title-icon {
    font-size: 2.2rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__content {
    max-height: 500px;
    overflow-y: auto;
  }

  &__loading,
  &__empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: $color_text_secondary;
    font-size: 1.5rem;
    text-align: center;
    padding: 2rem;
  }

  &__loading-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__empty-icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    opacity: 0.5;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__empty-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin: 0 0 0.8rem;
  }

  &__empty-text {
    max-width: 300px;
    line-height: 1.5;
  }

  &__list {
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    :root.light-theme & {
      border-color: $light_header_border;

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    :root.dark-theme & {
      border-color: $dark_header_border;

      &:hover {
        background-color: rgba(255, 255, 255, 0.02);
      }
    }
  }

  &__icon {
    width: 4rem;
    height: 4rem;
    min-width: 4rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.5rem;
    font-size: 2rem;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  &__name {
    font-size: 1.6rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: $color_text_primary;
  }

  &__preview {
    font-size: 1.4rem;
    color: $color_text_secondary;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__time {
    font-size: 1.3rem;
    color: $color_text_secondary;
    margin-left: 1.5rem;
    white-space: nowrap;
  }

  &__modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-out forwards;
    padding: 2rem;
  }

  &__modal {
    width: 100%;
    max-width: 70rem;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 1.5rem;
    animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    overflow: hidden;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: #080d11;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;

    :root.light-theme & {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  &__modal-title {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  &__modal-close {
    background: transparent;
    border: none;
    cursor: pointer;
    width: 3.6rem;
    height: 3.6rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    :root.light-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: $color_text_primary;
      }
    }

    :root.dark-theme & {
      color: $color_text_secondary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        color: $color_text_primary;
      }
    }
  }

  &__modal-close-icon {
    font-size: 2.4rem;
  }

  &__modal-body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0;
    overflow-y: auto;
  }

  &__conversation {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    max-height: 50vh;
  }

  &__messages {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__message {
    display: flex;
    margin-bottom: 1.5rem;
    align-items: flex-start;
    width: 100%;

    &--user {
      justify-content: flex-start;
    }

    &--assistant {
      justify-content: flex-end;
    }
  }

  &__message-bubble {
    max-width: 70%;
    padding: 1.2rem 1.6rem;
    border-radius: 1.2rem;

    &--user {
      :root.light-theme & {
        background-color: #f2f2f2;
        color: #333;
        border-bottom-left-radius: 0.4rem;
      }

      :root.dark-theme & {
        background-color: #1a2230;
        color: #fff;
        border-bottom-left-radius: 0.4rem;
      }
    }

    &--assistant {
      :root.light-theme & {
        background-color: #0072f5;
        color: white;
        border-bottom-right-radius: 0.4rem;
      }

      :root.dark-theme & {
        background-color: #00c972;
        color: #080d11;
        border-bottom-right-radius: 0.4rem;
      }
    }
  }

  &__message-content {
    font-size: 1.5rem;
    line-height: 1.5;
    white-space: pre-wrap;
  }

  &__message-time {
    font-size: 1.2rem;
    margin-top: 0.5rem;
    text-align: right;
    opacity: 0.8;
  }

  &__empty-messages {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15rem;
    color: $color_text_secondary;
    font-size: 1.5rem;
  }

  &__details {
    padding: 0 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    border-top: 1px solid;
    padding-top: 2rem;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.1);
    }
  }

  &__detail-row {
    display: flex;
    align-items: center;

    @include mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  &__detail-label {
    flex: 0 0 20%;
    font-weight: 500;
    font-size: 1.5rem;
    color: $color_text_secondary;
  }

  &__detail-value {
    flex: 1;
    font-size: 1.5rem;

    &--id {
      font-family: monospace;
      padding: 0.4rem 0.8rem;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 0.4rem;

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
