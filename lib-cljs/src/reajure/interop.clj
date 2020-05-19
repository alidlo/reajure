(ns reajure.interop
  (:require [helix.impl.props :as hxp]))

;; Intern all components into namespace.
;; Note: the desired `tags` must be statically declared since `c` object is not available in clj.
(def tags '[vw
            txt
            ipt
            lbl
            btn])

(defn ->js-style "Convert clj style `props` for given `style-kw` to its js equivalent."
  [props style-kw]
  (if (get props style-kw)
    (assoc props style-kw (hxp/into-js-array (for [v (get props style-kw)]
                                               (cond (keyword? v) (hxp/camel-case v)
                                                     (map? v)     (hxp/primitive-obj v)
                                                     :else v))))
    props))

(defn ->js-props "Converts cljs `props` to js props."
  [props]
  (-> props
      (->js-style :style)
      (->js-style :textStyle)))

