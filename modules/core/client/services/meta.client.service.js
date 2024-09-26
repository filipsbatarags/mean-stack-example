(function () {
  'use strict';

/*
This service can be used in MeanJS to add support for dynamic meta tag content depending on the
view that is rendered by ui-router. The same code can be reused in other SPAs with minor adjustments.

Usage: Copy this file in public/modules/core/services/ of MeanJS. Then inject the $meta service
into a controller and use any of the following statements to set the view's meta tag content.

    $meta.setTitle('view title');
    $meta.setDescription('view description');
    $meta.setKeywords('view, keywords');
    $meta.addKeywords('additional, keywords, to, the, default');

    $meta.get('anyOtherMetaTagName').content = 'custom content';

Works with MeanJS's MEAN-SEO module - the cached pages will have the correct meta data for search engines.

Also works well with the browser's back button right-click, users no longer see a single title for
all visited pages, they can now view the titles of visited pages and navigate back to them.
*/

angular
    .module('core')
    .service('$meta', ['$rootScope', function ($rootScope)
{
	var meta = this;

	// One off initialization
	if (!meta._elements)
	{
		// Filter down to elements that have either the name attribute or the property attribute
		meta._elements = angular.element('meta').filter(function(i, e)
		{
			e.metaName = e.name || e.property;
            //alert(e.metaName);
			return e.metaName;
		});
		// Save the original values so that we can reset the elements if we want
		meta._originalValues = meta._elements.map(function(i, e)
		{
			return { name: e.metaName, value: e.content };
		});

		// Also get the title element
		meta._title = angular.element('title')[0] || {};
		meta._originalTitle = meta._title.innerText;
	}

	// Get an element by the metaName we have given to it
	meta.get = function(name)
	{
		return meta._elements.filter(function(i, e)
			{
				return e.metaName === name;
			})[0] || {};
	};

	// Reset all elements to their original values
	meta.reset = function()
	{
		meta._originalValues.map(function(i, e)
		{
			meta.get(e.name).content = e.value;
		});
		meta._title.innerText = meta._originalTitle;
	};

	// When navigating to a different view, reset the meta elements so that they can be re-set by the controllers.
	// Also works well with the browser back button
	$rootScope.$on('$locationChangeSuccess', function(next, current)
	{
		meta.reset();
	});

	//
	// SEO useful methods start here
	//

	meta.setTitle = function(title)
	{
		meta._title.innerText = meta.get('og:title').content = meta.get('twitter:title').content = title;
	};
    
    meta.setImage = function(image)
    {
        meta.get('og:image').content = meta.get('twitter:image').content = image;
    };

	meta.setDescription = function(description)
	{
		meta.get('description').content = meta.get('og:description').content = meta.get('twitter:description').content = description;
	};

	meta.setKeywords = function(keywords)
	{
		meta.get('keywords').content = keywords;
	};

	meta.addKeywords = function(keywords)
	{
		meta.get('keywords').content += ',' + keywords;
	};

	return meta;
}]);
    }());