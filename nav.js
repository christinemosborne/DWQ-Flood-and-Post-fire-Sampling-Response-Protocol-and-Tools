/* Shared site menu. Each page loads this with data-root (path to the site root) and data-current. */
(function () {
  var me = document.currentScript, root = me.getAttribute('data-root') || '', cur = me.getAttribute('data-current') || '';
  var cfg = window.TOOLKIT_CONFIG || {};
  var items = [
    ['home', 'Home', root + 'index.html'],
    ['guide', 'Response Guide', root + 'response-guide.html'],
    ['min', 'Minimum Response', root + 'minimum-response.html'],
    ['roles', 'Who Samples What', root + 'who-samples-what.html'],
    ['hub', 'Data Hub', root + 'data-hub.html'],
    ['sap', 'SAP Builder', root + 'sap-builder.html'],
    ['risk', 'Risk Communication', root + 'risk-communication.html']
  ];
  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'Toolkit');
  var html = '<div class="in"><a class="brand" href="' + root + 'index.html">DWQ Flood and Post-Fire Toolkit</a>';
  items.forEach(function (it) {
    html += '<a class="nl" href="' + it[2] + '"' + (it[0] === cur ? ' aria-current="page"' : '') + '>' + it[1] + '</a>';
  });
  html += '</div>';
  nav.innerHTML = html;
  me.parentNode.insertBefore(nav, me);
})();
