<template>
    <CustomButton @click="exportPdf" btn-type="primary">
        Export resume pdf
    </CustomButton>
</template>

<script>
import CustomButton from './CustomButton.vue';

export default {
    components: {
        CustomButton
    },
    methods: {
        exportPdf() {
            const resume = document.getElementById('resume');
            html2pdf().from(resume).save();
        }
    }
}
</script>