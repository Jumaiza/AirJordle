(function () {

    var _doc = window.document;

    var _numOfImageSlots = 12,
            _numOfImagesPerRow = 4,
            _imageMarginBottom = 30;

    var _imageAspectWidth = 1920,
            _imageAspectHeight = 1080;

    var _imageSlots = [],
            _selectedImageElement = null,
            _originalImageSlot = null,
            _originalClickCoords = null,
            _lastTouchedSlotId = null;

    var _imageLibrary = [
    { id: 1, image: '/1-12/jordan1.png', title: 'Air Jordan 1' },
        { id: 2, image: '/1-12/jordan2.png', title: 'Air Jordan 2' },
        { id: 3, image: '/1-12/jordan3.png', title: 'Air Jordan 3' },
        { id: 4, image: '/1-12/jordan4.png', title: 'Air Jordan 4' },
        { id: 5, image: '/1-12/jordan5.png', title: 'Air Jordan 5' },
        { id: 6, image: '/1-12/jordan6.png', title: 'Air Jordan 6' },
        { id: 7, image: '/1-12/jordan7.png', title: 'Air Jordan 7' },
        { id: 8, image: '/1-12/jordan8.png', title: 'Air Jordan 8' },
        { id: 9, image: '/1-12/jordan9.png', title: 'Air Jordan 9' },
        { id: 10, image: '/1-12/jordan10.png', title: 'Air Jordan 10' },
        { id: 11, image: '/1-12/jordan11.png', title: 'Air Jordan 11' },
        { id: 12, image: '/1-12/jordan12.png', title: 'Air Jordan 12' }],
                _listedImageIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }

    shuffle(_listedImageIds);

    function init () {

        addImageSlots();
        drawImages();

        _doc.getElementById('dragDrop').addEventListener('mousemove', imageMousemove);
        
        checkGuess();

    }

    var attempts=3;
    function checkGuess() {

            var guessButton = _doc.getElementById("submitButton");
            guessButton.addEventListener("click",function(){

            var numCorrect=0;

            attempts--;
            _doc.getElementById('attemptsLeft').innerHTML=attempts+" Attempts Left!";
                
            var i = 0;
            var len = _listedImageIds.length;

            for (; i<len;i++){

                currentShoe = _listedImageIds[i];
                slotOfShoe = getIndexOfImageId(currentShoe)+1;
                element = _doc.querySelector('[data-image-id="' + currentShoe + '"]');

                if(currentShoe==slotOfShoe){
                    element.classList.remove('dd-item-incorrect');
                    element.classList.add('dd-item-correct');
                    title=_doc.getElementById('title'+currentShoe);
                    title.innerHTML="Air Jordan "+currentShoe;
                    numCorrect++;
                }else{
                    element.classList.add('dd-item-incorrect');
                }
            }

            if(numCorrect==12){
                guessButton.disabled = true;
                if (confirm("Congrats on winning. Press OK or Refresh to play again!")) {
                    window.location.reload();
                } 
            }
            else if(attempts==0 ){

                guessButton.disabled=true;

                var i = 0,
                    len = _listedImageIds.length;

                for (; i<len;i++){

                    currentShoe = _listedImageIds[i];
                    title=_doc.getElementById('title'+currentShoe);
                    title.innerHTML="Air Jordan "+currentShoe;
                }

                if (confirm("You ran out of attempts. Press OK or Refresh to try again!")) {
                    window.location.reload();
                } 
            }

            console.log(attempts);

        });

        }


    function addImageSlots () {

        var i = 0,
                len = _numOfImageSlots,
                item;

        var wrap = _doc.getElementById('dragDrop');

        for ( ; i < len; i++ ) {

            item = _doc.createElement('div');

            item.setAttribute('class', 'dd-slot');
            item.setAttribute('slot-number',(i+1));
            item.setAttribute('style', 'width:' + ( 100 / _numOfImagesPerRow ) + '%;padding-bottom:' + ( ( 100 / _numOfImagesPerRow ) * ( _imageAspectHeight / _imageAspectWidth ) ) + '%;margin-bottom:' + _imageMarginBottom + 'px;');

            item.innerHTML = '<p class="dd-slot-num dd-vc">Air Jordan ' + ( i + 1 ) + '</p>';

            wrap.appendChild(item);

        }

    }

    function drawImages () {

        var i = 0,
                len = _numOfImageSlots,
                item;

        var wrap = _doc.getElementById('dragDrop');

        var slot = _doc.getElementsByClassName('dd-slot')[0],
                bounds = slot.getBoundingClientRect(),
                itemWidth = bounds.width,
                itemHeight = bounds.height;

        var itemX,
                itemY;

        var imageId,
                image;

        for ( ; i < len; i++ ) {

            imageId = _listedImageIds[i] || -1;
            image = getImageById( imageId );

            itemX = ( i % _numOfImagesPerRow ) * itemWidth;
            itemY = Math.floor( i / _numOfImagesPerRow ) * ( itemHeight + _imageMarginBottom );

            item = _doc.createElement('div');

            item.setAttribute('class', 'dd-item dd-transition' + ( imageId < 0 ? ' dd-disabled' : '' ));
            item.setAttribute('data-image-id', imageId);
            item.setAttribute('style', 'width:' + itemWidth + 'px;height:' + itemHeight + 'px;transform:translate3d(' + itemX + 'px,' + itemY + 'px,0);' );

            item.innerHTML = '<div class="dd-item-inner dd-shadow" style="' + ( image ? ( 'background-image:url(' + image.image + ')' ) : '' ) + '"><div class="dd-item-panel dd-shadow"><h3 class="dd-item-title" id=title'+(imageId)+'>Air Jordan ??</h3></div></div>';

            wrap.appendChild(item);

            item.addEventListener('mousedown', imageMousedown);
            item.addEventListener('mouseup', imageMouseup);

            _imageSlots[i] = { width: itemWidth, height: itemHeight, x: itemX, y: itemY };

        }

    }
    function arrangeItems () {

        var i = 0,
                len = _listedImageIds.length,
                slot,
                ele;

        for ( ; i < len; i++ ) {

            slot = _imageSlots[i];
            ele = _doc.querySelector('[data-image-id="' + _listedImageIds[i] + '"]');

            ele.style.transform = 'translate3d(' + slot.x + 'px,' + slot.y + 'px,0)';

        }

    }

    function imageMousedown ( event ) {

        if ( !_selectedImageElement ) {

            _selectedImageElement = event.currentTarget;
            _originalClickCoords = { x: event.pageX, y: event.pageY };
            _originalImageSlot = getIndexOfImageId( _selectedImageElement.getAttribute('data-image-id') );

            _selectedImageElement.classList.add('dd-selected');
            _selectedImageElement.classList.remove('dd-transition');

        }

    }

    function imageMousemove ( event ) {

        if ( _selectedImageElement ) {

            var wrap = _doc.getElementById('dragDrop'),
                    bounds = wrap.getBoundingClientRect(),
                    left = bounds.left,
                    top = bounds.top;

            var pageX = event.pageX,
                    pageY = event.pageY;

            var clickX = pageX - left,
                    clickY = pageY - top,
                    hoverSlotId = getSlotIdByCoords( { x: clickX, y: clickY } );

            var ele = _selectedImageElement,
                    imageId = ele.getAttribute('data-image-id'),
                    index = _originalImageSlot,
                    newIndex = getIndexOfImageId( imageId ),
                    x = _imageSlots[index].x,
                    y = _imageSlots[index].y;

            var resultX = x + ( pageX - _originalClickCoords.x ),
                    resultY = y + ( pageY - _originalClickCoords.y );

            if ( hoverSlotId != undefined && _lastTouchedSlotId != hoverSlotId ) {

                _lastTouchedSlotId = hoverSlotId;

                _listedImageIds.splice( hoverSlotId, 0, _listedImageIds.splice( newIndex, 1 )[0] );
                arrangeItems();

            }

            ele.style.transform = 'translate3d(' + resultX + 'px,' + resultY + 'px,0)';

        }

    }
    function imageMouseup () {

        _selectedImageElement.classList.remove('dd-selected');
        _selectedImageElement.classList.add('dd-transition');

        _selectedImageElement = null;
        _originalClickCoords = null;

        arrangeItems();

    }

    function getSlotIdByCoords ( coords ) {

        // Get the current slot being hovered over
        for ( var id in _imageSlots ) {

            var slot = _imageSlots[id];

            if ( slot.x <= coords.x && coords.x <= slot.x + slot.width && slot.y <= coords.y && coords.y <= slot.y + slot.height )
                return id;

        }

    }
    function getImageById ( id ) {

        return _imageLibrary.find(function (image) {
            return image.id == id;
        });

    }
    function getIndexOfImageId ( id ) {

        var i = 0,
                len = _listedImageIds.length;

        for ( ; i < len; i++ )
            if ( _listedImageIds[i] == id )
                return i;

    }

    init();

})();
