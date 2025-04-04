<script setup lang="ts">
import { computed, ref } from "vue";

defineProps({
  animationComplete: {
    type: Boolean,
    default: false,
  },
});

const logs = ref([
  {
    id: 1,
    timestamp: "2025-04-04 15:23:12",
    severity: "error",
    source: "Urządzenie ESP32-Living",
    message: "Utracono połączenie z siecią WiFi",
    details: "Timeout po 30s próbie ponownego połączenia",
  },
  {
    id: 2,
    timestamp: "2025-04-04 14:56:47",
    severity: "warning",
    source: "System",
    message: "Wysokie zużycie pamięci",
    details: "Zużycie pamięci osiągnęło 85% dostępnych zasobów",
  },
  {
    id: 3,
    timestamp: "2025-04-04 14:45:11",
    severity: "info",
    source: "Użytkownik admin@example.com",
    message: "Zalogowano do systemu",
    details: "Adres IP: 192.168.1.45",
  },
  {
    id: 4,
    timestamp: "2025-04-04 14:32:22",
    severity: "info",
    source: "System",
    message: "Automatyczna kopia zapasowa zakończona",
    details: "Pomyślnie utworzono kopię zapasową konfiguracji",
  },
  {
    id: 5,
    timestamp: "2025-04-04 13:16:05",
    severity: "error",
    source: "Baza danych",
    message: "Błąd podczas zapisu danych",
    details: "Nieudana próba zapisu danych z czujnika temperatury",
  },
  {
    id: 6,
    timestamp: "2025-04-04 12:45:32",
    severity: "warning",
    source: "Urządzenie ESP32-Kitchen",
    message: "Niski poziom baterii",
    details: "Pozostało 15% baterii",
  },
  {
    id: 7,
    timestamp: "2025-04-04 10:22:18",
    severity: "info",
    source: "System",
    message: "Aktualizacja systemu dostępna",
    details: "Nowa wersja systemu 2.3.5 jest dostępna do instalacji",
  },
  {
    id: 8,
    timestamp: "2025-04-03 23:15:42",
    severity: "error",
    source: "Usługa API",
    message: "Błąd uwierzytelniania zewnętrznego API",
    details: "Kod błędu: 401, Wiadomość: Unauthorized",
  },
  {
    id: 9,
    timestamp: "2025-04-03 21:08:55",
    severity: "info",
    source: "Urządzenie ESP32-Garden",
    message: "Urządzenie połączone",
    details: "Urządzenie pomyślnie połączyło się z systemem",
  },
  {
    id: 10,
    timestamp: "2025-04-03 19:34:27",
    severity: "warning",
    source: "Sieć",
    message: "Wysoka latencja sieci",
    details: "Średnia latencja: 350ms",
  },
]);

const showFromCalendar = ref(false);
const showToCalendar = ref(false);

const fromDateInput = ref(null);
const toDateInput = ref(null);

const filters = ref({
  search: "",
  severity: "all",
  dateFrom: "",
  dateTo: "",
  source: "",
  fromDate: null,
  toDate: null,
});

const toggleFromCalendar = () => {
  showFromCalendar.value = !showFromCalendar.value;
  if (showFromCalendar.value) showToCalendar.value = false;
};

const toggleToCalendar = () => {
  showToCalendar.value = !showToCalendar.value;
  if (showToCalendar.value) showFromCalendar.value = false;
};

const formatDate = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const generateCalendar = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayIndex = firstDayOfMonth.getDay();

  const days = [];

  for (let i = 0; i < firstDayIndex; i++) {
    days.push({ day: "", isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  return days;
};

const currentFromDate = ref(new Date());
const currentToDate = ref(new Date());

const fromCalendarDays = computed(() =>
  generateCalendar(currentFromDate.value.getFullYear(), currentFromDate.value.getMonth()),
);

const toCalendarDays = computed(() =>
  generateCalendar(currentToDate.value.getFullYear(), currentToDate.value.getMonth()),
);

const navigateMonth = (calendarType, direction) => {
  if (calendarType === "from") {
    currentFromDate.value = new Date(
      currentFromDate.value.getFullYear(),
      currentFromDate.value.getMonth() + direction,
      1,
    );
  } else {
    currentToDate.value = new Date(
      currentToDate.value.getFullYear(),
      currentToDate.value.getMonth() + direction,
      1,
    );
  }
};

const formatMonth = (date) => {
  return date.toLocaleString("default", { month: "long", year: "numeric" });
};

const isToday = (year, month, day) => {
  const today = new Date();
  return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
};

const handleDateSelect = (calendarType, day) => {
  if (!day.isCurrentMonth) return;

  const currentDate = calendarType === "from" ? currentFromDate.value : currentToDate.value;
  const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.day);

  console.log(`Selected date for ${calendarType}: ${selectedDate.toISOString()}`);

  if (calendarType === "from") {
    filters.value.fromDate = selectedDate;
    filters.value.dateFrom = formatDate(selectedDate);

    if (fromDateInput.value) {
      fromDateInput.value.value = formatDate(selectedDate);
    }

    showFromCalendar.value = false;
  } else {
    filters.value.toDate = selectedDate;
    filters.value.dateTo = formatDate(selectedDate);

    if (toDateInput.value) {
      toDateInput.value.value = formatDate(selectedDate);
    }

    showToCalendar.value = false;
  }
};

const isSelectedDate = (calendarType, day) => {
  if (!day.isCurrentMonth) return false;

  const selectedDate = calendarType === "from" ? filters.value.fromDate : filters.value.toDate;
  if (!selectedDate) return false;

  const currentDate = calendarType === "from" ? currentFromDate.value : currentToDate.value;

  return (
    selectedDate.getFullYear() === currentDate.getFullYear() &&
    selectedDate.getMonth() === currentDate.getMonth() &&
    selectedDate.getDate() === day.day
  );
};

const filteredLogs = computed(() => {
  let result = [...logs.value];

  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(
      (log) =>
        log.message.toLowerCase().includes(searchTerm) ||
        log.source.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm),
    );
  }

  if (filters.value.severity !== "all") {
    result = result.filter((log) => log.severity === filters.value.severity);
  }

  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom);
    result = result.filter((log) => new Date(log.timestamp) >= fromDate);
  }

  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo);
    toDate.setHours(23, 59, 59, 999);
    result = result.filter((log) => new Date(log.timestamp) <= toDate);
  }

  if (filters.value.source) {
    const sourceTerm = filters.value.source.toLowerCase();
    result = result.filter((log) => log.source.toLowerCase().includes(sourceTerm));
  }

  return result;
});

const clearFilters = () => {
  filters.value = {
    search: "",
    severity: "all",
    dateFrom: "",
    dateTo: "",
    source: "",
    fromDate: null,
    toDate: null,
  };
};

const downloadLogs = () => {
  const logData = JSON.stringify(filteredLogs.value, null, 2);
  const blob = new Blob([logData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `system-logs-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const showDeleteLogsConfirmation = ref(false);

const triggerDeleteOldLogs = () => {
  showDeleteLogsConfirmation.value = true;
};

const confirmDeleteOldLogs = () => {
  console.log("Deleting old logs");

  // Tutaj w przyszłości będzie odwołanie do API
  // Np: await deleteLogsService.removeOldLogs();

  showDeleteLogsConfirmation.value = false;
};

const cancelDeleteOldLogs = () => {
  showDeleteLogsConfirmation.value = false;
};

const expandedLogId = ref<number | null>(null);

const toggleLogDetails = (id: number) => {
  if (expandedLogId.value === id) {
    expandedLogId.value = null;
  } else {
    expandedLogId.value = id;
  }
};

const logStats = computed(() => {
  const total = logs.value.length;
  const errors = logs.value.filter((log) => log.severity === "error").length;
  const warnings = logs.value.filter((log) => log.severity === "warning").length;
  const info = logs.value.filter((log) => log.severity === "info").length;

  return { total, errors, warnings, info };
});

const closeCalendars = (e) => {
  const fromCalendarEl = document.getElementById("from-calendar");
  const toCalendarEl = document.getElementById("to-calendar");
  const fromInputEl = fromDateInput.value;
  const toInputEl = toDateInput.value;

  if (
    fromCalendarEl &&
    !fromCalendarEl.contains(e.target) &&
    (!fromInputEl || !fromInputEl.contains(e.target))
  ) {
    showFromCalendar.value = false;
  }

  if (
    toCalendarEl &&
    !toCalendarEl.contains(e.target) &&
    (!toInputEl || !toInputEl.contains(e.target))
  ) {
    showToCalendar.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeCalendars);
});

onUnmounted(() => {
  document.removeEventListener("click", closeCalendars);
});
</script>

<template>
  <div
    class="admin-dashboard-logs"
    :class="{ 'admin-dashboard-logs--loaded': animationComplete }"
  >
    <div class="admin-dashboard-logs__header">
      <h2 class="admin-dashboard-logs__title">
        <Icon
          name="mdi:text-box-multiple"
          class="admin-dashboard-logs__icon"
        />
        Logi systemowe
      </h2>

      <div class="admin-dashboard-logs__header-controls">
        <div class="admin-dashboard-logs__stats">
          <button
            class="admin-dashboard-logs__stat-button admin-dashboard-logs__stat-button--total"
          >
            <span class="admin-dashboard-logs__stat-value">{{ logStats.total }}</span>
            <span class="admin-dashboard-logs__stat-label">Wszystkie</span>
          </button>
          <button
            class="admin-dashboard-logs__stat-button admin-dashboard-logs__stat-button--error"
          >
            <span class="admin-dashboard-logs__stat-value">{{ logStats.errors }}</span>
            <span class="admin-dashboard-logs__stat-label">Błędy</span>
          </button>
          <button
            class="admin-dashboard-logs__stat-button admin-dashboard-logs__stat-button--warning"
          >
            <span class="admin-dashboard-logs__stat-value">{{ logStats.warnings }}</span>
            <span class="admin-dashboard-logs__stat-label">Ostrzeżenia</span>
          </button>
          <button class="admin-dashboard-logs__stat-button admin-dashboard-logs__stat-button--info">
            <span class="admin-dashboard-logs__stat-value">{{ logStats.info }}</span>
            <span class="admin-dashboard-logs__stat-label">Informacje</span>
          </button>
        </div>

        <div class="admin-dashboard-logs__actions">
          <button
            class="admin-dashboard-logs__action-button"
            @click="downloadLogs"
          >
            <Icon
              name="mdi:download"
              class="admin-dashboard-logs__action-icon"
            />
            Pobierz logi
          </button>
          <button
            class="admin-dashboard-logs__action-button admin-dashboard-logs__action-button--danger"
            @click="triggerDeleteOldLogs"
          >
            <Icon
              name="mdi:delete-sweep"
              class="admin-dashboard-logs__action-icon"
            />
            Usuń stare logi
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Panel -->
    <div class="admin-dashboard-logs__filters-panel">
      <div class="admin-dashboard-logs__search">
        <div class="admin-dashboard-logs__search-wrapper">
          <Icon
            name="mdi:magnify"
            class="admin-dashboard-logs__search-icon"
          />
          <input
            v-model="filters.search"
            type="text"
            class="admin-dashboard-logs__search-input"
            placeholder="Szukaj w logach..."
          />
          <button
            v-if="filters.search"
            class="admin-dashboard-logs__search-clear"
            @click="filters.search = ''"
          >
            <Icon name="mdi:close" />
          </button>
        </div>
      </div>

      <div class="admin-dashboard-logs__filters">
        <div class="admin-dashboard-logs__filter">
          <label class="admin-dashboard-logs__filter-label">Typ</label>
          <div class="admin-dashboard-logs__select-wrapper">
            <select
              v-model="filters.severity"
              class="admin-dashboard-logs__select"
            >
              <option value="all">Wszystkie</option>
              <option value="info">Info</option>
              <option value="warning">Ostrzeżenie</option>
              <option value="error">Błąd</option>
            </select>
            <Icon
              name="mdi:chevron-down"
              class="admin-dashboard-logs__select-icon"
            />
          </div>
        </div>

        <div class="admin-dashboard-logs__filter">
          <label class="admin-dashboard-logs__filter-label">Od</label>
          <div class="admin-dashboard-logs__date-input-wrapper">
            <input
              ref="fromDateInput"
              v-model="filters.dateFrom"
              type="text"
              class="admin-dashboard-logs__input admin-dashboard-logs__date-input"
              placeholder="YYYY-MM-DD"
              readonly
              @click="toggleFromCalendar"
            />
            <button
              class="admin-dashboard-logs__calendar-button"
              @click.stop="toggleFromCalendar"
            >
              <Icon
                name="mdi:calendar"
                class="admin-dashboard-logs__calendar-icon"
              />
            </button>

            <!-- Custom Calendar Dropdown -->
            <div
              v-show="showFromCalendar"
              id="from-calendar"
              class="admin-dashboard-logs__calendar-dropdown"
              @click.stop
            >
              <div class="admin-dashboard-logs__calendar-header">
                <button
                  class="admin-dashboard-logs__calendar-nav"
                  @click="navigateMonth('from', -1)"
                >
                  <Icon name="mdi:chevron-left" />
                </button>
                <span class="admin-dashboard-logs__calendar-month">
                  {{ formatMonth(currentFromDate) }}
                </span>
                <button
                  class="admin-dashboard-logs__calendar-nav"
                  @click="navigateMonth('from', 1)"
                >
                  <Icon name="mdi:chevron-right" />
                </button>
              </div>

              <div class="admin-dashboard-logs__calendar-weekdays">
                <span>Nd</span>
                <span>Pn</span>
                <span>Wt</span>
                <span>Śr</span>
                <span>Cz</span>
                <span>Pt</span>
                <span>Sb</span>
              </div>

              <div class="admin-dashboard-logs__calendar-days">
                <button
                  v-for="(day, index) in fromCalendarDays"
                  :key="index"
                  class="admin-dashboard-logs__calendar-day"
                  :class="{
                    'admin-dashboard-logs__calendar-day--inactive': !day.isCurrentMonth,
                    'admin-dashboard-logs__calendar-day--today': isToday(
                      currentFromDate.getFullYear(),
                      currentFromDate.getMonth(),
                      day.day,
                    ),
                    'admin-dashboard-logs__calendar-day--selected': isSelectedDate('from', day),
                  }"
                  @click="handleDateSelect('from', day)"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-dashboard-logs__filter">
          <label class="admin-dashboard-logs__filter-label">Do</label>
          <div class="admin-dashboard-logs__date-input-wrapper">
            <input
              ref="toDateInput"
              v-model="filters.dateTo"
              type="text"
              class="admin-dashboard-logs__input admin-dashboard-logs__date-input"
              placeholder="YYYY-MM-DD"
              readonly
              @click="toggleToCalendar"
            />
            <button
              class="admin-dashboard-logs__calendar-button"
              @click.stop="toggleToCalendar"
            >
              <Icon
                name="mdi:calendar"
                class="admin-dashboard-logs__calendar-icon"
              />
            </button>

            <!-- Custom Calendar Dropdown -->
            <div
              v-show="showToCalendar"
              id="to-calendar"
              class="admin-dashboard-logs__calendar-dropdown"
              @click.stop
            >
              <div class="admin-dashboard-logs__calendar-header">
                <button
                  class="admin-dashboard-logs__calendar-nav"
                  @click="navigateMonth('to', -1)"
                >
                  <Icon name="mdi:chevron-left" />
                </button>
                <span class="admin-dashboard-logs__calendar-month">
                  {{ formatMonth(currentToDate) }}
                </span>
                <button
                  class="admin-dashboard-logs__calendar-nav"
                  @click="navigateMonth('to', 1)"
                >
                  <Icon name="mdi:chevron-right" />
                </button>
              </div>

              <div class="admin-dashboard-logs__calendar-weekdays">
                <span>Nd</span>
                <span>Pn</span>
                <span>Wt</span>
                <span>Śr</span>
                <span>Cz</span>
                <span>Pt</span>
                <span>Sb</span>
              </div>

              <div class="admin-dashboard-logs__calendar-days">
                <button
                  v-for="(day, index) in toCalendarDays"
                  :key="index"
                  class="admin-dashboard-logs__calendar-day"
                  :class="{
                    'admin-dashboard-logs__calendar-day--inactive': !day.isCurrentMonth,
                    'admin-dashboard-logs__calendar-day--today': isToday(
                      currentToDate.getFullYear(),
                      currentToDate.getMonth(),
                      day.day,
                    ),
                    'admin-dashboard-logs__calendar-day--selected': isSelectedDate('to', day),
                  }"
                  @click="handleDateSelect('to', day)"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-dashboard-logs__filter">
          <label class="admin-dashboard-logs__filter-label">Źródło</label>
          <input
            v-model="filters.source"
            type="text"
            class="admin-dashboard-logs__input"
            placeholder="np. System"
          />
        </div>

        <button
          class="admin-dashboard-logs__filter-clear"
          @click="clearFilters"
        >
          <Icon
            name="mdi:filter-remove"
            class="admin-dashboard-logs__filter-clear-icon"
          />
          Wyczyść filtry
        </button>
      </div>
    </div>

    <div class="admin-dashboard-logs__card">
      <div
        v-if="filteredLogs.length === 0"
        class="admin-dashboard-logs__empty"
      >
        <Icon
          name="mdi:text-box-remove"
          class="admin-dashboard-logs__empty-icon"
        />
        <p class="admin-dashboard-logs__empty-text">Brak logów spełniających kryteria</p>
      </div>

      <div
        v-else
        class="admin-dashboard-logs__log-list custom-scrollbar"
      >
        <div
          v-for="log in filteredLogs"
          :key="log.id"
          class="admin-dashboard-logs__log-item"
          :class="[
            `admin-dashboard-logs__log-item--${log.severity}`,
            { 'admin-dashboard-logs__log-item--expanded': expandedLogId === log.id },
          ]"
          @click="toggleLogDetails(log.id)"
        >
          <div class="admin-dashboard-logs__log-header">
            <div class="admin-dashboard-logs__log-severity">
              <Icon
                :name="`mdi:${log.severity === 'error' ? 'alert-circle' : log.severity === 'warning' ? 'alert' : 'information'}`"
                class="admin-dashboard-logs__severity-icon"
              />
            </div>

            <div class="admin-dashboard-logs__log-timestamp">{{ log.timestamp }}</div>
            <div class="admin-dashboard-logs__log-source">{{ log.source }}</div>
            <div class="admin-dashboard-logs__log-message">{{ log.message }}</div>

            <div class="admin-dashboard-logs__log-expand">
              <Icon
                :name="expandedLogId === log.id ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="admin-dashboard-logs__expand-icon"
              />
            </div>
          </div>

          <div
            v-if="expandedLogId === log.id"
            class="admin-dashboard-logs__log-details"
          >
            <p class="admin-dashboard-logs__details-label">Szczegóły:</p>
            <p class="admin-dashboard-logs__details-text">{{ log.details }}</p>

            <div class="admin-dashboard-logs__details-actions">
              <button class="admin-dashboard-logs__details-button">
                <Icon name="mdi:content-copy" />
                Kopiuj
              </button>
              <button class="admin-dashboard-logs__details-button">
                <Icon name="mdi:export" />
                Eksportuj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showDeleteLogsConfirmation"
      class="admin-dashboard-logs__modal"
    >
      <div class="admin-dashboard-logs__modal-header">
        <Icon
          name="mdi:alert-circle"
          class="admin-dashboard-logs__modal-icon"
        />
        <h3 class="admin-dashboard-logs__modal-title">Usuwanie starych logów</h3>
      </div>
      <div class="admin-dashboard-logs__modal-content">
        <p>Czy na pewno chcesz usunąć stare logi? Ta operacja jest nieodwracalna.</p>
      </div>
      <div class="admin-dashboard-logs__modal-actions">
        <button
          class="admin-dashboard-logs__modal-button admin-dashboard-logs__modal-button--cancel"
          @click="cancelDeleteOldLogs"
        >
          <Icon
            name="mdi:close"
            class="admin-dashboard-logs__modal-button-icon"
          />
          Anuluj
        </button>
        <button
          class="admin-dashboard-logs__modal-button admin-dashboard-logs__modal-button--confirm"
          @click="confirmDeleteOldLogs"
        >
          <Icon
            name="mdi:check"
            class="admin-dashboard-logs__modal-button-icon"
          />
          Potwierdź
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "~/assets/styles/global/variables/card_styles" as *;

.admin-dashboard-logs {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: 0.3s;
  margin-bottom: 3rem;

  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    margin-bottom: 2rem;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 2.2rem;
    font-weight: 600;
    margin: 0;
  }

  &__icon {
    font-size: 2.4rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__header-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.2rem;

    @include mobile {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @include mobile {
      width: 100%;
      justify-content: space-between;
    }
  }

  &__stat-button {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem 1.6rem;
    border-radius: 2rem;
    font-size: 1.4rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.03);

      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.03);

      &:hover {
        background-color: rgba(255, 255, 255, 0.06);
      }
    }

    @include mobile {
      flex: 1;
      justify-content: center;
      padding: 0.7rem 1rem;
    }

    &--total {
      .admin-dashboard-logs__stat-value {
        color: $color_text_primary;
      }
    }

    &--error {
      .admin-dashboard-logs__stat-value {
        color: #dc2626;
      }
    }

    &--warning {
      .admin-dashboard-logs__stat-value {
        color: #f59e0b;
      }
    }

    &--info {
      .admin-dashboard-logs__stat-value {
        color: #3b82f6;
      }
    }
  }

  &__stat-value {
    font-size: 1.5rem;
    font-weight: 600;
  }

  &__stat-label {
    color: $color_text_secondary;
  }

  &__actions {
    display: flex;
    gap: 1rem;

    @include mobile {
      width: 100%;
      flex-direction: column;
    }
  }

  &__action-button {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem 1.6rem;
    border-radius: 2rem;
    font-size: 1.4rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    :root.light-theme & {
      background-color: rgba(0, 114, 245, 0.1);
      color: #0072f5;

      &:hover {
        background-color: #0072f5;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 114, 245, 0.2);
      }
    }

    :root.dark-theme & {
      background-color: rgba(0, 201, 114, 0.1);
      color: #00c972;

      &:hover {
        background-color: #00c972;
        color: #0e131b;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 201, 114, 0.2);
      }
    }

    &--danger {
      :root.light-theme & {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover {
          background-color: #dc2626;
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
      }

      :root.dark-theme & {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover {
          background-color: #dc2626;
          color: white;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
      }
    }

    &:active {
      transform: translateY(1px);
    }

    @include mobile {
      width: 100%;
      justify-content: center;
    }
  }

  &__action-icon {
    font-size: 1.8rem;
  }

  &__filters-panel {
    margin-bottom: 2rem;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.02);
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.02);
    }

    border-radius: 1.2rem;
    padding: 1.5rem;
  }

  &__search {
    margin-bottom: 1.5rem;
  }

  &__search-wrapper {
    position: relative;

    :root.light-theme & {
      background-color: white;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: #080d11;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    border-radius: 0.8rem;
    height: 4.6rem;
    display: flex;
    align-items: center;
  }

  &__search-icon {
    font-size: 2rem;
    margin-left: 1.5rem;
    color: $color_text_secondary;
  }

  &__search-input {
    flex: 1;
    height: 100%;
    padding: 0 1.5rem;
    border: none;
    background: transparent;
    font-size: 1.5rem;
    color: $color_text_primary;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $color_text_secondary;
    }
  }

  &__search-clear {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    margin-right: 1rem;
    color: $color_text_secondary;
    font-size: 1.6rem;

    &:hover {
      color: $color_text_primary;
    }
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: flex-end;

    @include mobile {
      flex-direction: column;
      gap: 1rem;
    }
  }

  &__filter {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 12rem;

    @include mobile {
      width: 100%;
    }
  }

  &__filter-label {
    font-size: 1.3rem;
    font-weight: 500;
    color: $color_text_secondary;
  }

  &__select-wrapper {
    position: relative;
  }

  &__select {
    appearance: none;
    width: 100%;
    padding: 0.8rem 1.6rem;
    padding-right: 3.5rem;
    border-radius: 0.6rem;
    font-size: 1.4rem;
    cursor: pointer;

    :root.light-theme & {
      border: 1px solid rgba(0, 0, 0, 0.1);
      background-color: white;
      color: $color_text_primary;
    }

    :root.dark-theme & {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #080d11;
      color: $color_text_primary;
    }

    &:focus {
      outline: none;

      :root.light-theme & {
        border-color: #0072f5;
        box-shadow: 0 0 0 2px rgba(0, 114, 245, 0.2);
      }

      :root.dark-theme & {
        border-color: #00c972;
        box-shadow: 0 0 0 2px rgba(0, 201, 114, 0.2);
      }
    }
  }

  &__select-icon {
    position: absolute;
    right: 1.2rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: $color_text_secondary;
    font-size: 1.8rem;
  }

  &__date-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__date-input {
    cursor: pointer;
    padding-right: 3.5rem;
  }

  &__calendar-button {
    position: absolute;
    right: 0.8rem;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
  }

  &__calendar-icon {
    font-size: 1.8rem;

    :root.light-theme & {
      color: #0072f5;
    }

    :root.dark-theme & {
      color: #00c972;
    }
  }

  &__calendar-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    z-index: 100;
    width: 28rem;
    border-radius: 0.8rem;
    padding: 1.2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    :root.light-theme & {
      background-color: white;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: #121a20;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  &__calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  &__calendar-month {
    font-size: 1.4rem;
    font-weight: 500;
    color: $color_text_primary;
    text-transform: capitalize;
  }

  &__calendar-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border: none;
    border-radius: 50%;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s;

    :root.light-theme & {
      color: $color_text_primary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    :root.dark-theme & {
      color: $color_text_primary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  &__calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.2rem;
    margin-bottom: 0.8rem;

    span {
      text-align: center;
      font-size: 1.2rem;
      font-weight: 500;
      color: $color_text_secondary;
      padding: 0.4rem 0;
    }
  }

  &__calendar-days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.2rem;
  }

  &__calendar-day {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3.2rem;
    font-size: 1.3rem;
    border: none;
    border-radius: 0.4rem;
    background: none;
    cursor: pointer;
    color: $color_text_primary;

    &:hover:not(&--inactive) {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.05);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }

    &--inactive {
      color: $color_text_secondary;
      opacity: 0.5;
      cursor: default;
    }

    &--today {
      font-weight: 700;

      :root.light-theme & {
        color: #0072f5;
      }

      :root.dark-theme & {
        color: #00c972;
      }
    }

    &--selected {
      :root.light-theme & {
        background-color: #0072f5;
        color: white;
      }

      :root.dark-theme & {
        background-color: #00c972;
        color: #0e131b;
      }
    }
  }

  &__input {
    padding: 0.8rem 1.6rem;
    border-radius: 0.6rem;
    font-size: 1.4rem;

    :root.light-theme & {
      border: 1px solid rgba(0, 0, 0, 0.1);
      background-color: white;
      color: $color_text_primary;
    }

    :root.dark-theme & {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background-color: #080d11;
      color: $color_text_primary;
    }

    &:focus {
      outline: none;

      :root.light-theme & {
        border-color: #0072f5;
        box-shadow: 0 0 0 2px rgba(0, 114, 245, 0.2);
      }

      :root.dark-theme & {
        border-color: #00c972;
        box-shadow: 0 0 0 2px rgba(0, 201, 114, 0.2);
      }
    }
  }

  &__filter-clear {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.6rem;
    border-radius: 0.6rem;
    font-size: 1.4rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    margin-left: auto;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    @include mobile {
      width: 100%;
      justify-content: center;
      margin-top: 1rem;
    }
  }

  &__filter-clear-icon {
    font-size: 1.6rem;
  }

  &__card {
    border-radius: $dark_card_border_radius;
    min-height: 40rem;
    max-height: 60vh;
    overflow: hidden;

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
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8rem 2rem;
    text-align: center;
  }

  &__empty-icon {
    font-size: 6rem;
    margin-bottom: 2rem;
    opacity: 0.5;
    color: $color_text_secondary;
  }

  &__empty-text {
    font-size: 1.8rem;
    color: $color_text_secondary;
  }

  &__log-list {
    max-height: 60vh;
    overflow-y: auto;
  }

  &__log-item {
    border-bottom: 1px solid;
    cursor: pointer;
    transition: background-color 0.2s ease;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.05);

      &:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);

      &:hover {
        background-color: rgba(255, 255, 255, 0.03);
      }
    }

    &--expanded {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.02);
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.03);
      }
    }

    &--error {
      .admin-dashboard-logs__severity-icon {
        color: #dc2626;
      }

      &:hover,
      &.admin-dashboard-logs__log-item--expanded {
        :root.light-theme & {
          background-color: rgba(220, 38, 38, 0.05);
        }

        :root.dark-theme & {
          background-color: rgba(220, 38, 38, 0.08);
        }
      }
    }

    &--warning {
      .admin-dashboard-logs__severity-icon {
        color: #f59e0b;
      }

      &:hover,
      &.admin-dashboard-logs__log-item--expanded {
        :root.light-theme & {
          background-color: rgba(245, 158, 11, 0.05);
        }

        :root.dark-theme & {
          background-color: rgba(245, 158, 11, 0.08);
        }
      }
    }

    &--info {
      .admin-dashboard-logs__severity-icon {
        color: #3b82f6;
      }

      &:hover,
      &.admin-dashboard-logs__log-item--expanded {
        :root.light-theme & {
          background-color: rgba(59, 130, 246, 0.05);
        }

        :root.dark-theme & {
          background-color: rgba(59, 130, 246, 0.08);
        }
      }
    }
  }

  &__log-header {
    display: flex;
    align-items: center;
    padding: 1.6rem;
    gap: 1.6rem;

    @include mobile {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }

  &__log-severity {
    flex: 0 0 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__severity-icon {
    font-size: 2rem;
  }

  &__log-timestamp {
    flex: 0 0 16rem;
    font-size: 1.4rem;
    color: $color_text_secondary;

    @include mobile {
      flex: 1 1 100%;
      order: 1;
    }
  }

  &__log-source {
    flex: 0 0 20%;
    font-size: 1.4rem;
    font-weight: 500;

    @include mobile {
      flex: 1 1 50%;
      order: 3;
    }
  }

  &__log-message {
    flex: 1;
    font-size: 1.5rem;

    @include mobile {
      flex: 1 1 100%;
      order: 2;
      padding: 0.5rem 0;
    }
  }

  &__log-expand {
    flex: 0 0 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @include mobile {
      order: 4;
    }
  }

  &__expand-icon {
    font-size: 2rem;
    color: $color_text_secondary;
    transition: transform 0.2s ease;
  }

  &__log-details {
    padding: 0 1.6rem 1.6rem 5.6rem;
    animation: expandDetails 0.3s ease-out forwards;

    @include mobile {
      padding: 0 1.6rem 1.6rem 1.6rem;
    }
  }

  &__details-label {
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 0.8rem;
    color: $color_text_primary;
  }

  &__details-text {
    font-size: 1.4rem;
    line-height: 1.5;
    color: $color_text_secondary;
    white-space: pre-wrap;
    padding: 1rem;
    border-radius: 0.6rem;
    font-family: "Consolas", monospace;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.03);
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }

  &__details-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    justify-content: flex-end;

    @include mobile {
      flex-direction: column;
      gap: 0.8rem;
    }
  }

  &__details-button {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 1.2rem;
    border-radius: 0.6rem;
    font-size: 1.3rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    :root.light-theme & {
      background-color: rgba(0, 0, 0, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    :root.dark-theme & {
      background-color: rgba(255, 255, 255, 0.05);
      color: $color_text_primary;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    @include mobile {
      justify-content: center;
    }
  }

  &__modal {
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    width: 100%;
    max-width: 460px;
    border-radius: 1.2rem;
    padding: 2rem;
    animation: slideDown 0.3s ease-out forwards;

    :root.light-theme & {
      background-color: white;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    }

    :root.dark-theme & {
      background-color: #101419;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  }

  &__modal-header {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin-bottom: 1.6rem;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid;

    :root.light-theme & {
      border-color: rgba(0, 0, 0, 0.05);
    }

    :root.dark-theme & {
      border-color: rgba(255, 255, 255, 0.05);
    }
  }

  &__modal-icon {
    font-size: 2.4rem;
    color: #ff6a00;
  }

  &__modal-title {
    font-size: 1.8rem;
    font-weight: 600;
    color: $color_text_primary;
  }

  &__modal-content {
    margin-bottom: 2rem;

    p {
      font-size: 1.5rem;
      line-height: 1.5;
      color: $color_text_primary;
    }
  }

  &__modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  &__modal-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.8rem 1.6rem;
    border-radius: 0.6rem;
    font-size: 1.4rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &--cancel {
      :root.light-theme & {
        background-color: rgba(0, 0, 0, 0.05);
        color: $color_text_primary;

        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }

      :root.dark-theme & {
        background-color: rgba(255, 255, 255, 0.05);
        color: $color_text_primary;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }

    &--confirm {
      :root.light-theme & {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;

        &:hover {
          background-color: #dc2626;
          color: white;
        }
      }

      :root.dark-theme & {
        background-color: rgba(239, 68, 68, 0.1);
        color: #ef4444;

        &:hover {
          background-color: #ef4444;
          color: white;
        }
      }
    }
  }

  &__modal-button-icon {
    font-size: 1.8rem;
  }
}

.custom-scrollbar {
  /* WebKit browsers (Chrome, Safari) */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
  }

  /* Firefox */
  scrollbar-width: thin;

  :root.light-theme & {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  :root.dark-theme & {
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

@keyframes expandDetails {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    transform: translate(-50%, -10px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}
</style>
