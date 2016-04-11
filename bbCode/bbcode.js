angular.module('bbcode', [])
    .constant('MODULE_VERSION', '0.0.1')
    .directive('bbcode', [function() {
        function link(scope, element, attrs) {

            scope.$watch('update', function (newValue) {
                if (element.html()) {
                    var result = bbcodeParser.parse(element.html());
                    element.html(scope.walk(result));
                }
            });

            scope.validURL = function(url) {
                return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
            };

            scope.walk = function(tree, parent) {
                var res = "";
                for (var i=0;i<tree.length;i++) {
                    if (tree[i].tag == "") {
                        if (parent) {
                            res += scope.filter(parent, tree[i].content);
                        } else {
                            res += tree[i].content;
                        }
                    } else {
                        if (scope.tags[tree[i].tag]) {
                            var stage = scope.tags[tree[i].tag](scope.walk(tree[i].content, tree[i].tag), tree[i].attr);
                            if (stage) {
                                res += stage;
                                continue;
                            }
                        }
                        res += tree[i].raw + scope.walk(tree[i].content, null) + '[/' + tree[i].tag + ']';
                    }
                }
                return res;
            };

            scope.filter = function(tag, content) {
                if (tag == "ol" || tag == "ul") {
                    return ""; // nothing between <li>'s, including newlines
                }
                if (tag == "li") {
                    return content.replace("<br />", "")
                }
                return content;
            };

            scope.tags = {
                "p": function (content, attr) {
                    return "<p>" + content + "</p>";
                },
                "ol": function (content, attr) {
                    return "<ol>" + content + "</ol>";
                },
                "ul": function (content, attr) {
                    return "<ul>" + content + "</ul>";
                },
                "li": function (content, attr) {
                    return "<li>" + content + "</li>";
                },
                "b": function (content, attr) {
                    return "<b>" + content + "</b>";
                },
                "i": function (content, attr) {
                    return "<i>" + content + "</i>";
                },
                "u": function (content, attr) {
                    return "<u>" + content + "</u>";
                },
                "s": function (content, attr) {
                    return "<s>" + content + "</s>";
                },
                "center": function (content, attr) {
                    return "<div align='center'>" + content + "</div>";
                },
                "left": function (content, attr) {
                    return "<div align='left'>" + content + "</div>";
                },
                "right": function (content, attr) {
                    return "<div align='right'>" + content + "</div>";
                },

                "size": function (content, attr) {
                    var size = parseInt(attr);
                    if (size >= 1 && size <= 7)
                        return "<font style=\"font-size: \" size=\"" + size + "\">" + content + "</font>";
                    else
                        return false;
                },

                "quote": function (content, attr) {
                    return "<blockquote>" + content + "</blockquote>";
                },

                "youtube": function (content, attr) {
                    var ret = '<iframe width="560" height="315" frameborder="0" allowfullscreen="true" ';
                    var id = "";
                    if (content.match(/^[a-zA-Z0-9_\-]{11}$/)) {
                        id = content;
                    } else if (m = /^https?:\/\/(www.)?youtube.com\/watch.*v=([a-zA-Z0-9_\-]{11}).*$/i.exec(content)) {
                        id = m[2];
                    } else {
                        return false;
                    }
                    ret += 'data-youtube-id="' + id + '" ';
                    ret += 'src="https://www.youtube.com/embed/' + id + '?wmode=opaque"';
                    ret += '></iframe>';
                    return ret;
                },

                "code": function (content, attr) {
                    return "<code>" + content + "</code>"
                },

                "img": function (content, attr) {
                    if (scope.validURL(content.trim())) {
                        return '<img style="max-width:600px;max-height:500px" src="' + content.trim() + '" />';
                    } else {
                        return false;
                    }
                },

                "url": function (content, attr) {
                    if (scope.validURL(attr.trim())) {
                        return '<a rel="nofollow" target="_blank" href="' + attr.trim() + '">' + content + '</a>';
                    } else if (scope.validURL(content.trim())) {
                        return '<a rel="nofollow" target="_blank" href="' + content.trim() + '">' + content + '</a>';
                    } else {
                        return false;
                    }
                },

                "color": function (content, attr) {
                    if (attr.match(/^#[a-fA-F0-9]{6}$/))
                        return "<font color=\"" + attr + "\">" + content + "</font>";
                    else if (attr.match(/^[a-zA-Z]{1,30}$/))
                        return "<font color=\"" + attr + "\">" + content + "</font>";
                    else
                        return false;
                }
            };
        }

        return {
            link: link
        };
    }]);
