describe('lib/rules/validate-jsdoc/check-annotations', function() {
    var checker = global.checker({
        additionalRules: ['lib/rules/validate-jsdoc.js']
    });

    describe('with true', function() {
        checker.rules({checkAnnotations: true});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should throw unavailable tag',
                errors: {message: 'unavailable tag ppublic'},
                code: function() {
                    /**
                     * @ppublic
                     */
                }
            },
            {
                it: 'should not report valid tags',
                code: function() {
                    /** @const FOO */
                    var FOO = 'bar';

                    /**
                     * @chainable
                     * @abstract
                     * @accessor
                     * @param {string} message
                     * @return {string}
                     */
                    function _f() {}
                }
            },
            {
                it: 'should throw @access without data',
                errors: {message: 'incomplete data in tag access'},
                code: function() {
                    /** @access */
                }
            }
            /* jshint ignore:end */
        ]);
    });

    describe('with "jsduck5"', function() {
        checker.rules({checkAnnotations: 'jsduck5'});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not throw @alternateClassName',
                code: function() {
                    /** @alternateClassName Vasya */
                }
            },
            {
                it: 'should throw unavailable @arg',
                errors: {message: 'unavailable tag arg'},
                code: function() {
                    /**
                     * @arg
                     */
                }
            }
            /* jshint ignore:end */
        ]);
    });

    describe('with "jsdoc3" and extra tags', function() {
        checker.rules({checkAnnotations: {
            'preset': 'jsdoc3',
            'extra': {
                'empty': false,
                'fulfilled': true
            }
        }});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should not throw @boomer/@argument',
                code: function() {
                    /**
                     * @empty
                     * @fulfilled tag
                     * @argument {String} jsdoc3 specific tag
                     */
                }
            }, {
                it: 'should throw invalid tags',
                errors: 3,
                code: function() {
                    /**
                     * @empty with value
                     * @fulfilled
                     * @alternateClassName {string}
                     */
                }
            }
            /* jshint ignore:end */
        ]);
    });

    describe('with "jsdoc3" and disabled @arg, @argument tags', function() {
        checker.rules({checkAnnotations: {
            'preset': 'jsdoc3',
            'extra': {
                'arg': null,
                'argument': null
            }
        }});

        checker.cases([
            /* jshint ignore:start */
            {
                it: 'should throw',
                errors: 2,
                code: function() {
                    /**
                     * @arg {string}
                     * @argument {string}
                     */
                }
            }
            /* jshint ignore:end */
        ]);
    });

});
