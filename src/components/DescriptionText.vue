<template>
  <details class="accordion c-hand mt-2">
    <summary class="accordion-header p-0">
      <i class="icon icon-arrow-right mr-1"></i>
      吊り候補の除外対象
    </summary>
    <div class="accordion-body">
      <ul class="m-0">
        <li class="m-0">自分</li>
        <li class="m-0">死亡者</li>
        <li class="m-0">対抗なしの占、霊、狩</li>
        <li class="m-0">2人以上の占から白を出されている人</li>
        <li class="m-0">(占のみ) 自分が白を出した人</li>
        <li class="m-0">(占と霊が合計5人以上いるとき) COなし</li>
      </ul>
    </div>
  </details>
</template>

<script>
export default {
  name: "DescriptionText",
};
</script>

<style lang="scss" scoped>
.accordion-body {
  padding: 0 5px;
}

li::marker {
  margin-right: 0;
}
</style>
