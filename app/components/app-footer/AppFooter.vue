<script setup lang="ts">
import { Copyright } from '@lucide/vue'
</script>


<template>
  <footer>
    <UiPageContainer size="wide" gap="sm">
        <span class="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Copyright class="size-4" /> 
            {{ new Date().getFullYear() }} {{ $t('app.name') }}.
        </span>
    </UiPageContainer>
  </footer>
</template>
