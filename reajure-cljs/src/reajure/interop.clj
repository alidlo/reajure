(ns reajure.interop
  (:require [clojure.string :as str]
            [helix.impl.props :as hxp]))

;; Available component `tags` must be statically declared since component object is not available in clj
(def tags '[vw
            txt
            ipt
            lbl
            btn])

(defn ->js-style 
  "Convert clj `props` style in key `sk` to js style.
   Clj style value can be a keyword or a map. 
   Keywords should be lisp-cased, e.g., :flx-1 => 'flx1' or :jc-sb => 'jcSB'."
  [props sk]
  (if (get props sk)
    (assoc props sk (hxp/into-js-array (for [v (get props sk)]
                                         (cond (keyword? v) (let [k (name v)
                                                                  [k1 k2] (str/split k #"-")]
                                                              (str/join "" [k1 (str/upper-case k2)]))
                                               (map? v)     (hxp/primitive-obj v)
                                               :else v))))
    props))

(defn ->js-props "Converts cljs `props` to js props."
  [props]
  (-> props
      (->js-style :style)
      (->js-style :textStyle)))

