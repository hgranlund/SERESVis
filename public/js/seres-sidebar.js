function SideBar(util) {
    this._node = {};
    this._createElement();
}

SideBar.prototype = {
    constructor: SideBar,
    elementId: 'sidebar',
    elementClass: 'sidebar',
    _color: 'white',

    _createElement: function () {
        var found = document.getElementById(this.elementId);

        if (!found) {
            this.el = document.createElement("div");
            this.el.class = this.className;
            this.el.id = this.elementId;
            this.el.className = this.elementClass;
            // this.el.style.display = "none";
            document.body.appendChild(this.el);
        } else {
            this.el = found;
        }
        this.hide();
    },

    render: function () {
        var node = this.getNode(),
            content;
        if (node.hasOwnProperty('source')) {
            content = this._getContentLink(node);
            this.el.style.background = 'rgba(' + node.source.color.r + ',' + node.source.color.g + ',' + node.source.color.b + ', .6)';
        } else {
            content = this._getContentNode(node);
            this.el.style.background = 'rgba(' + node.color.r + ',' + node.color.g + ',' + node.color.b + ', .6)';
        }

        if (!this._node) {
            throw new Error("Must set a node before rendering");
        }
        this.el.innerHTML = content;

        return this;
    },


    _getContentLink: function (link) {
        var header, content = [];
        if (link.source.isIndividual) {
            header = 'Link mellom ' + link.target.name + ' og en instans av ' + link.source.name;
        } else if (link.source.isProperty) {
            header = link.source.name + ' har ' + link.name + ' ' + link.target.name;
        } else {
            header = link.source.name + ' er ' + link.name + ' ' + link.target.name;
        }
        content.push('<h4>');
        content.push(header);
        content.push('</h4>');
        return content.join('');
    },

    _getContentNode: function (node) {
        var data_key,
            content = [],
            header = '';

        if (node.isIndividual) {
            header = 'Instans av';
        } else if (node.isProperty) {
            header = 'Domene egenskap';
        } else {
            header = 'Domene';
        }
        content.push('<h3>');
        content.push(header);
        content.push(': ' + node.name);
        content.push('</h3>');

        for (data_key in node.data) {
            content.push('<div>');
            content.push('<span class="name">' + data_key + ': </span>');
            content.push(node.data[data_key]);
            content.push('</div>');
        }
        // for (data_key in node) {
        //     content.push('<div>');
        //     content.push('<span class="name">' + data_key + ': </span>');
        //     content.push(node[data_key]);
        //     content.push('</div>');
        // }
        // for (data_key in node.object) {
        //     content.push('<div>');
        //     content.push('<span class="name">' + data_key + ': </span>');
        //     content.push(node.object[data_key]);
        //     content.push('</div>');
        // }
        // for (data_key in node.parents) {
        //     content.push('<div>');
        //     content.push('<span class="name">' + data_key + ': </span>');
        //     content.push(node.parents[data_key]);
        //     content.push('</div>');
        // }
        return content.join('');
    },

    setColor: function (color) {
        this._color = color;
    },

    setNode: function (node) {
        this._node = node;
    },

    getNode: function () {
        return this._node;
    },

    show: function (node) {
        // offset && this.setOffset(offset);
        if (node) {
            this.setNode(node);
        }
        this.render();
        $(this.el).show("slide", {
            direction: "rigth",
            duration: 200

        });
    },

    hide: function () {
        // $(this.el).hide();
        $(this.el).hide("slide", {
            direction: "rigth",
            duration: 20
        });
    }
};

SideBar.fn = SideBar.prototype;
window.seres.sidebar = new SideBar(window.seres.utilities);
