var Slider = (function(){
    var Slide = {
        currentSlide: 0,
        slidesLength: 0,
        next: function(){
            this.setSlide((this.currentSlide + 1)%this.slidesLength)
        },
        prev: function(){
            this.setSlide(this.currentSlide ? (this.currentSlide - 1)%this.slidesLength : this.slidesLength - 1);
        },
        setSlide: function(slideId){
            if(slideId >= this.slidesLength) slideId = 0;
            this.setCss(slideId);
            this.currentSlide = slideId;
        },
        setCss: function(ind){
            var left = ind*100;
            this.container.style.left = (-left) + '%';

            [].forEach.call(document.querySelectorAll('.pager button'), function(el){
                el.classList.remove('active');
            });

            document.querySelector('button[data-index="'+ ind +'"]').classList.add('active');
        },
        setParams: function(contaier){
            console.log(contaier.className);
            this.slidesLength = document.querySelectorAll('.' + contaier.className + '>div>*').length;

            this.container = contaier.querySelector('div');

            var pager = document.createElement('ul'), i, j;
            pager.classList.add('pager');

            for(i = 0, j = this.slidesLength; i < j; i++){
                var li = document.createElement('li'),
                    btn = document.createElement('button');
                li.appendChild(btn);
                btn.setAttribute('data-index', i);
                pager.appendChild(li);    
            }

            pager.addEventListener('click', function(e){
                if(e.target.tagName.toLowerCase() === 'button'){
                    this.setSlide(e.target.dataset.index);
                }
            }.bind(this), false);
            contaier.appendChild(pager);
            this.setCss(0);
        }
    };

    window.addEventListener('DOMContentLoaded', function(){
        Slide.setParams(document.querySelector('section'));
    });

    window.addEventListener('keyup', function(e){
        var keys = {
            "37": Slide.prev.bind(Slide),
            "38": Slide.next.bind(Slide),
            "39": Slide.next.bind(Slide),
            "40": Slide.prev.bind(Slide),
        }
        
        keys[e.keyCode] && keys[e.keyCode]();
    });

    return Slide;
})();