<script lang="ts">
    import { page } from '$app/state';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-base-200 px-4">
    <div class="text-center">
        <p class="text-8xl font-bold text-base-content/20">{page.status}</p>
        <h1 class="mt-4 text-2xl font-semibold text-base-content">
            {page.status === 404 ? 'Page not found' : 'Something went wrong'}
        </h1>
        <p class="mt-2 text-base-content/60">
            {page.status === 404
                ? "The page you're looking for doesn't exist."
                : page.error?.message ?? 'An unexpected error occurred.'}
        </p>
    </div>
</div>
