<?php
/**
 * Title: This week's roasts
 * Slug: lumo/roasts
 * Categories: lumo, query
 * Description: Three newest roasts with origin, process, notes, roast level and price taken from the roast fields.
 */
?>
<!-- wp:group {"align":"full","layout":{"type":"constrained"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"},"margin":{"top":"0"}}}} -->
<div class="wp-block-group alignfull" style="margin-top:0;padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">
	<!-- wp:group {"align":"wide","className":"lumo-reveal","layout":{"type":"flex","flexWrap":"wrap","justifyContent":"space-between","verticalAlignment":"bottom"},"style":{"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-group alignwide lumo-reveal" style="margin-bottom:var(--wp--preset--spacing--50)">
		<!-- wp:group {"layout":{"type":"constrained","contentSize":"620px","justifyContent":"left"},"style":{"spacing":{"blockGap":"0.75rem"}}} -->
		<div class="wp-block-group">
			<!-- wp:paragraph {"className":"lumo-eyebrow"} -->
			<p class="lumo-eyebrow">On the menu this week</p>
			<!-- /wp:paragraph -->
			<!-- wp:heading -->
			<h2 class="wp-block-heading">Three coffees, roasted to order</h2>
			<!-- /wp:heading -->
		</div>
		<!-- /wp:group -->
		<!-- wp:paragraph -->
		<p><a href="/roasts/">See all roasts →</a></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
	<!-- wp:query {"queryId":11,"query":{"perPage":3,"pages":0,"offset":0,"postType":"roast","order":"asc","orderBy":"menu_order","inherit":false},"align":"wide"} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"className":"lumo-reveal-group","layout":{"type":"grid","columnCount":3,"minimumColumnWidth":"17rem"},"style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
			<!-- wp:group {"className":"is-style-card lumo-linked-card","style":{"spacing":{"blockGap":"0","padding":{"bottom":"var:preset|spacing|40"}},"dimensions":{"minHeight":"100%"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group is-style-card lumo-linked-card" style="min-height:100%;padding-bottom:var(--wp--preset--spacing--40)">
				<!-- wp:post-featured-image {"aspectRatio":"1","className":"lumo-zoom","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} /-->
				<!-- wp:group {"layout":{"type":"flex","orientation":"vertical"},"style":{"spacing":{"blockGap":"0.6rem","padding":{"left":"var:preset|spacing|40","right":"var:preset|spacing|40"}}}} -->
				<div class="wp-block-group" style="padding-right:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)">
					<!-- wp:paragraph {"className":"lumo-roast-level","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"lumo_roast"}}}}} -->
					<p class="lumo-roast-level"></p>
					<!-- /wp:paragraph -->
					<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"x-large"} /-->
					<!-- wp:paragraph {"className":"lumo-meta","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"lumo_origin"}}}}} -->
					<p class="lumo-meta"></p>
					<!-- /wp:paragraph -->
					<!-- wp:paragraph {"className":"lumo-notes","metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"lumo_notes"}}}}} -->
					<p class="lumo-notes"></p>
					<!-- /wp:paragraph -->
					<!-- wp:paragraph {"style":{"typography":{"fontWeight":"600"}},"metadata":{"bindings":{"content":{"source":"core/post-meta","args":{"key":"lumo_price"}}}}} -->
					<p style="font-weight:600"></p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:group -->
		<!-- /wp:post-template -->
	</div>
	<!-- /wp:query -->
</div>
<!-- /wp:group -->
