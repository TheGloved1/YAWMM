<script lang="ts">
  interface Props {
    names: string[];
    replace: boolean;
    onReplace?: (v: boolean) => void;
  }
  let { names, replace = $bindable(false), onReplace }: Props = $props();

  function toggle() {
    const v = !replace;
    (replace as any) = v;
    onReplace?.(v);
  }
</script>

<div class="rounded-[7px] border border-[#c9a45c]/40 bg-[#c9a45c]/10 px-3 py-2 text-[13px]">
  <div class="font-semibold text-[#dbb977]">
    {#if names.length === 1}
      Replaces "{names[0]}" (same mod).
    {:else}
      Replaces {names.length} installed mods (same Nexus ID).
    {/if}
  </div>
  {#if names.length > 1}
    <div class="mt-1 truncate text-muted-foreground">{names.join(', ')}</div>
  {/if}
  <label class="mt-1 flex cursor-pointer items-center gap-2">
    <input type="checkbox" bind:checked={replace} class="h-4 w-4 accent-[#c9a45c]" />
    <span>Uninstall {names.length === 1 ? 'it' : 'them'} and install this instead</span>
  </label>
</div>
