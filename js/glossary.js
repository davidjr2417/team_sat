$(function() {
  var loadedData = false,
  		$wrapper = $('.wrapper'),
      source = $('#glossary-template').html(),
      template = Handlebars.compile(source),
      $termsList = $('.glossary-terms'),
      $search = $('input[type=search]'),
      terms;

  // After each key stroke compare the search box query against the name and description of each term
  $search.on('keyup input propertychange paste', function() {
    var filtered = filterTerms(terms);
    // Recompile the template with the filtered,alphebetized terms list
    compileTemplate(filtered);
  });

  function loadData(filter) {
    $termsList.empty().append('<li>Loading terms...</li>');
    getData(filter,DATA);
  }
 function getData(filter, data) {
    terms = data;
    if (filter) data = filterTerms(terms);
    compileTemplate(data);
    loadedData = true;
  }
  function filterTerms(data) {
    var query = $search.val().toLowerCase();
    return $.grep(data, function(obj) {
      return (obj.name.toLowerCase().indexOf(query) >= 0 || obj.description.toLowerCase().indexOf(query) >= 0);
    });
  }

  function compileTemplate(data) {
    data.sort(compare);
    $termsList.empty().append( template({ 'terms': data }) );
    registerTagHandler();
  }

  // change search term when user clicks a tag
  function registerTagHandler() {
    var $tag = $('.tag');
    $tag.on('click', function() {
      $search.val($(this).text());

      var filtered = filterTerms(terms);
      compileTemplate(filtered);
    });
  }

  //filter function for ordering glossary terms
  function compare(a,b) {
    if (a.name < b.name)
       return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  $( document ).ready(function() {
    if (!loadedData) loadData();
   $wrapper.addClass('show-glossary');
  });
});
