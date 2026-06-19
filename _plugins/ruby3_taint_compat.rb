# Local-development compatibility shim.
#
# Ruby 3.2 removed Object#tainted? / #taint / #untaint, but the Liquid 4.0.3
# version pinned by the `github-pages` gem still calls `tainted?` during
# rendering, which crashes `jekyll serve` locally on modern Ruby.
#
# GitHub Pages builds run Jekyll in --safe mode, which ignores everything in
# _plugins/, so this file has NO effect on the deployed site. It only makes
# local builds work. Safe to delete if you downgrade to Ruby 2.7.
if RUBY_VERSION >= "3.2" && !"".respond_to?(:tainted?)
  class Object
    def tainted?
      false
    end

    def taint
      self
    end

    def untaint
      self
    end
  end
end
