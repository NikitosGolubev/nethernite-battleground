<script>
import { mapActions } from 'vuex';
import SearchPackages from '@/components/SearchPackages/SearchPackages.vue';
import PackagesTable from '@/components/PackagesTable/PackagesTable.vue';
import BasePagination from '@/components/BasePagination/BasePagination.vue';
import PackageModal from '@/components/PackageModal/PackageModal.vue';

export default {
  name: 'HomePage',

  components: {
    SearchPackages,
    PackagesTable,
    BasePagination,
    PackageModal,
  },

  props: {
    searchParam: { type: String, default: '' },
    limit: { type: [String, Number], default: 10 },
    page: { type: [String, Number], default: 1 },
  },

  data: () => ({
    packages: [],
    searchInput: '',
    isLoading: false,
    currentPage: 1,
    selectedPackageName: '',
    isPackageDetailsWindowOpened: false,
  }),

  computed: {
    title() {
      if (this.isSearchInputProvided) {
        return this.$t('searched-packages');
      }
      return this.$t('most-popular-packages');
    },

    isSearchInputProvided() {
      return (
        (!!this.searchInput || !!this.searchParam) &&
        (this.searchInput?.length > 1 || this.searchParam?.length > 1)
      );
    },
  },

  watch: {
    searchParam: {
      handler(value) {
        if (value !== this.searchInput) {
          this.setSearchInput(value);
        }
      },
      immediate: true,
    },

    searchInput(newValue) {
      this.setCurrentPage(1);
      this.setQueryParam('search', newValue);
    },

    page: {
      handler(value) {
        if (value !== this.currentPage) {
          this.setCurrentPage(value);
        }
      },
      immediate: true,
    },

    currentPage(newValue, oldValue) {
      if (newValue === oldValue) return;
      if (!this.isSearchInputProvided) this.getMostPopularPackages();
      this.setQueryParam('page', newValue);
    },

    isSearchInputProvided: {
      handler(value) {
        if (!value) this.getMostPopularPackages();
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions('packages', ['loadMostPopularPackages', 'getPackage']),
    ...mapActions('system', ['setErrorMessage']),

    async getMostPopularPackages() {
      try {
        this.setLoading(true);
        const packages = await this.loadMostPopularPackages({
          limit: this.limit,
          page: this.currentPage,
        });
        this.setPackages(packages);
      } catch (error) {
        if (error.message) this.setErrorMessage(error.message);
      } finally {
        this.setLoading(false);
      }
    },

    setQueryParam(param, value) {
      this.$router
        .push({ query: { ...this.$route.query, [param]: value } })
        .catch(() => {});
    },

    selectPackage(packageName) {
      this.selectedPackageName = packageName;
      this.isPackageDetailsWindowOpened = true;
    },

    unselectPackage() {
      this.selectedPackageName = '';
    },

    setLoading(value) {
      this.isLoading = value;
    },

    setSearchInput(value) {
      this.searchInput = value;
    },

    setPackages(packages) {
      this.packages = packages;
    },

    setCurrentPage(value) {
      this.currentPage = value;
    },
  },
};
</script>

<template>
  <div>
    <div>
      <SearchPackages
        v-model="searchInput"
        :per-page="limit"
        :page="currentPage"
        @loading="setLoading"
        @search-result="setPackages"
      />
    </div>

    <div class="packages-display">
      <div class="results-header packages-display__header">
        <div>
          <span class="text-sm-h6 text-md-h4">{{ title }}</span>
        </div>
        <div>
          <BasePagination v-model="currentPage" :items="packages" />
        </div>
      </div>

      <div>
        <PackagesTable
          :packages="packages"
          :is-search-result="isSearchInputProvided"
          :loading="isLoading"
          @row-click="selectPackage"
        />
      </div>
    </div>
    <PackageModal
      v-model="isPackageDetailsWindowOpened"
      :package-name="selectedPackageName"
      @close="unselectPackage"
    />
  </div>
</template>

<style lang="scss" scoped>
.packages-display {
  &__header {
    margin-bottom: 18px;
  }
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
}
</style>

<i18n>
{
  "en": {
    "most-popular-packages": "Most popular packages",
    "searched-packages": "Search result"
  },
  "ru": {
    "most-popular-packages": "Самые популярные пакеты",
    "searched-packages": "Результат поиска"
  }
}
</i18n>
