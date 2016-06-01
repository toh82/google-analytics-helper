# Trackables: a google-analytics helper

Tiny helper module to bind event trackers for example via data attributes

Checks on elements for data attributes and pushes them to google analytics  
- `data-ga-track`     to instantiate (required)
- `data-ga-event`     for js event binding (required)
- `data-ga-category`  ga event category (required)
- `data-ga-action`    ga event action (required)
- `data-ga-label`     ga event label
- `data-ga-value`     ga event value

## Example for data attributes

```
<button data-ga-track
        data-ga-event="click"
        data-ga-category="category"
        data-ga-action="action"
        data-ga-label="label"
        data-ga-value="value">
          click-tracker
</button>
```

## Example for jQuery binding

```
gaTrackables.buildTrackableElement($('.element'), {
   gaEvent: 'click',
   gaCategory: 'category',
   gaAction: 'action'
}, true);
```

The third parameter defines if the event should directly be bound, it should be set to `false` if the element should only be added to the list of trackables and `.init()` is executed afterwards.

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
