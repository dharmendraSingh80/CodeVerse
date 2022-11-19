class ToggleFriend{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleFriend();
    }


    toggleFriend(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                url: $(self).attr('href'),
            })
            .done(function(data) {
                let value = $(self).children('input').attr('value');
                console.log(value);
                if(data.data.deleted == true){
                    value="REMOVE";}
                else{
                    value="ADD";}
                    $(self).children('input').attr('value', value);
                    $(self).children('input').html(`${value}`);
            })
            .fail(function(errData) {
                console.log('error in completing the request');
            });
        })
    }
}
