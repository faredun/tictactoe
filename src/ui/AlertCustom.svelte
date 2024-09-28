<script lang="ts">
    import * as Alert from '$lib/components/ui/alert';
    type Props = {
        title: string;
        description: string;
    };
    let { title, description }: Props = $props();
</script>

<Alert.Root>
    <Alert.Title>{title}</Alert.Title>
    <Alert.Description>
        {description}
    </Alert.Description>
</Alert.Root>
